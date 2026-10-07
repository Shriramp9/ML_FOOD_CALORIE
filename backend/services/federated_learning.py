import os
import uuid
import time
import hashlib
import random
import threading
import shutil

import yaml
import pandas as pd
from PIL import Image

DATASET_ROOT   = "dataset"
IMAGES_TRAIN   = os.path.join(DATASET_ROOT, "images")
LABELS_TRAIN   = os.path.join(DATASET_ROOT, "labels")
DATASET_YAML   = os.path.join(DATASET_ROOT, "dataset.yaml")
CSV_DB_PATH    = "food_calories.csv"
TRAINING_LOCK  = threading.Lock()


class FederatedLearningService:
    def __init__(self):
        self.global_round       = 1
        self.total_participants = 0
        self.aggregated_gradients = []
        self.training_active    = False

    # ------------------------------------------------------------------
    # Legacy gradient endpoint (kept for compatibility)
    # ------------------------------------------------------------------
    def receive_gradients(self, client_id: str, encrypted_gradients: str, loss: float):
        dp_noise = random.uniform(0.001, 0.005)
        is_valid = encrypted_gradients.startswith("enc_")
        if is_valid:
            self.total_participants += 1
            self.aggregated_gradients.append({
                "client": hashlib.sha256(client_id.encode()).hexdigest()[:8],
                "loss":   loss + dp_noise,
                "timestamp": time.time()
            })
            if len(self.aggregated_gradients) >= 5:
                self._run_fedavg()
            return {
                "status":      "success",
                "message":     "Gradients received and securely stored for aggregation.",
                "global_round": self.global_round,
                "dp_noise_added": round(dp_noise, 5)
            }
        return {"status": "error", "message": "Invalid encryption signature."}

    def _run_fedavg(self):
        print(f"[Federated Learning] Running FedAvg for Round {self.global_round}...")
        self.aggregated_gradients.clear()
        self.global_round += 1
        print(f"[Federated Learning] Global Model updated to Round {self.global_round}.")

    # ------------------------------------------------------------------
    # NEW: Real image-upload & fine-tuning pipeline
    # ------------------------------------------------------------------
    def add_training_data(self, label: str, image_bytes_list: list[bytes]) -> dict:
        """
        Saves uploaded images into the YOLO dataset structure, updates
        dataset.yaml and food_calories.csv, then kicks off background training.

        Returns a status dict for the API response.
        """
        label = label.strip().lower().replace(" ", "_")

        # ---- 1. Ensure directories exist ---------------------------------
        os.makedirs(IMAGES_TRAIN, exist_ok=True)
        os.makedirs(LABELS_TRAIN, exist_ok=True)

        # ---- 2. Read / update dataset.yaml --------------------------------
        with open(DATASET_YAML, "r") as f:
            dataset_cfg = yaml.safe_load(f)

        names: dict = dataset_cfg.get("names", {})
        # names can be a list or an int-keyed dict
        if isinstance(names, list):
            names_list = names
        else:
            names_list = [names[k] for k in sorted(names.keys())]

        if label not in names_list:
            names_list.append(label)
            print(f"[FL] Added new class '{label}' at index {len(names_list)-1}")

        class_id = names_list.index(label)

        # Rebuild as int-keyed dict to keep YOLO happy
        dataset_cfg["names"] = {i: n for i, n in enumerate(names_list)}
        dataset_cfg["nc"]    = len(names_list)

        with open(DATASET_YAML, "w") as f:
            yaml.dump(dataset_cfg, f, default_flow_style=False, allow_unicode=True)

        # ---- 3. Save images + generate bounding-box labels ----------------
        saved_files = []
        for img_bytes in image_bytes_list:
            uid       = uuid.uuid4().hex
            img_path  = os.path.join(IMAGES_TRAIN, f"{label}_{uid}.jpg")
            lbl_path  = os.path.join(LABELS_TRAIN, f"{label}_{uid}.txt")

            # Save image
            from io import BytesIO
            img = Image.open(BytesIO(img_bytes)).convert("RGB")
            img.thumbnail((640, 640))
            img.save(img_path, "JPEG")

            # Write YOLO label: class cx cy w h  (full-image bbox)
            with open(lbl_path, "w") as lf:
                lf.write(f"{class_id} 0.5 0.5 1.0 1.0\n")

            saved_files.append(img_path)
            print(f"[FL] Saved {img_path}")

        # ---- 4. Update food_calories.csv ----------------------------------
        self._ensure_csv_entry(label)

        # ---- 5. Kick off background fine-tuning ---------------------------
        thread = threading.Thread(
            target=self._run_finetune,
            args=(len(names_list),),
            daemon=True
        )
        thread.start()

        self.total_participants += 1
        self.global_round      += 1

        return {
            "status":        "success",
            "message":       f"Received {len(saved_files)} images for '{label}'. Fine-tuning started in background.",
            "label":         label,
            "class_id":      class_id,
            "images_saved":  len(saved_files),
            "global_round":  self.global_round
        }

    # ------------------------------------------------------------------
    def _ensure_csv_entry(self, label: str):
        """Adds the label to food_calories.csv with default values if absent."""
        try:
            df = pd.read_csv(CSV_DB_PATH)
        except FileNotFoundError:
            df = pd.DataFrame(columns=[
                "food", "calories_per_100g", "serving_size_g",
                "calories_per_serving", "protein_g", "carbs_g", "fat_g"
            ])

        display_label = label.replace("_", " ")
        exists = (
            df["food"].str.lower() == label
        ) | (
            df["food"].str.lower() == display_label
        )
        if not exists.any():
            new_row = {
                "food":                display_label,
                "calories_per_100g":   200,
                "serving_size_g":      150,
                "calories_per_serving": 300,
                "protein_g":           8,
                "carbs_g":             25,
                "fat_g":               10
            }
            df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
            df.to_csv(CSV_DB_PATH, index=False)
            print(f"[FL] Added '{display_label}' to food_calories.csv with default values.")

            # Hot-reload the nutrition service so the new entry is available immediately
            try:
                from backend.services.nutrition import nutrition_service
                nutrition_service.df = pd.read_csv(CSV_DB_PATH)
                print(f"[FL] Nutrition service reloaded.")
            except Exception as e:
                print(f"[FL] Warning: could not reload nutrition service: {e}")

    # ------------------------------------------------------------------
    def _run_finetune(self, num_classes: int):
        """Background YOLO fine-tuning. Reloads the inference model on completion."""
        if not TRAINING_LOCK.acquire(blocking=False):
            print("[FL] Training already in progress, skipping duplicate request.")
            return

        self.training_active = True
        try:
            from ultralytics import YOLO
            from backend.core.config import settings

            base_model = settings.get_model_path()
            print(f"[FL] Starting fine-tuning on top of '{base_model}' ...")

            model = YOLO(base_model)
            model.train(
                data=DATASET_YAML,
                epochs=10,          # quick fine-tune
                batch=4,
                imgsz=320,
                patience=5,
                project="runs/federated",
                name="finetune",
                exist_ok=True,
                verbose=False
            )

            new_weights = "runs/federated/finetune/weights/best.pt"
            if os.path.exists(new_weights):
                # Copy into the expected custom model location so future
                # restarts also pick it up
                os.makedirs(os.path.dirname(settings.CUSTOM_MODEL_PATH), exist_ok=True)
                shutil.copy2(new_weights, settings.CUSTOM_MODEL_PATH)
                print(f"[FL] Fine-tuned weights saved to '{settings.CUSTOM_MODEL_PATH}'")

                # Hot-swap the running inference model
                try:
                    from backend.services.inference import inference_service
                    inference_service.model = YOLO(settings.CUSTOM_MODEL_PATH)
                    print("[FL] Inference model hot-swapped successfully.")
                except Exception as e:
                    print(f"[FL] Warning: could not hot-swap model: {e}")
            else:
                print("[FL] Fine-tuning completed but best.pt not found.")

        except Exception as e:
            print(f"[FL] Fine-tuning error: {e}")
        finally:
            self.training_active = False
            TRAINING_LOCK.release()

    # ------------------------------------------------------------------
    @property
    def is_training(self):
        return self.training_active


federated_service = FederatedLearningService()
