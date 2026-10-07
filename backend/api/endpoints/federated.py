from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List
from pydantic import BaseModel
from backend.services.federated_learning import federated_service

router = APIRouter()

# ── Legacy endpoint (kept for compatibility) ──────────────────────────────────
class GradientPayload(BaseModel):
    client_id: str
    encrypted_gradients: str
    loss: float
    samples_trained: int

@router.post("/submit-gradients")
async def submit_gradients(payload: GradientPayload):
    try:
        result = federated_service.receive_gradients(
            client_id=payload.client_id,
            encrypted_gradients=payload.encrypted_gradients,
            loss=payload.loss
        )
        if result["status"] == "error":
            raise HTTPException(status_code=400, detail=result["message"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── NEW endpoint: real image upload + fine-tuning ────────────────────────────
@router.post("/upload-data")
async def upload_training_data(
    label: str = Form(...),
    images: List[UploadFile] = File(...)
):
    """
    Accept 1-N images for a named food item, persist them to the YOLO
    dataset, update dataset.yaml & food_calories.csv, then kick off
    a background fine-tuning run.
    """
    if not label.strip():
        raise HTTPException(status_code=400, detail="Food label must not be empty.")

    if len(images) == 0:
        raise HTTPException(status_code=400, detail="At least one image is required.")

    # Validate content types & read bytes
    image_bytes_list: list[bytes] = []
    for upload in images:
        if not upload.content_type or not upload.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail=f"File '{upload.filename}' is not an image."
            )
        image_bytes_list.append(await upload.read())

    try:
        result = federated_service.add_training_data(label, image_bytes_list)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Status endpoint ───────────────────────────────────────────────────────────
@router.get("/status")
async def training_status():
    return {
        "is_training":        federated_service.is_training,
        "global_round":       federated_service.global_round,
        "total_participants": federated_service.total_participants,
    }
