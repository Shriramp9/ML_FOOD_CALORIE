from ultralytics import YOLO
from backend.core.config import settings

class InferenceService:
    def __init__(self):
        model_path = settings.get_model_path()
        print(f"Loading YOLO model from: {model_path}")
        self.model = YOLO(model_path)
        
    def predict(self, img_array, conf_threshold=0.25):
        results = self.model(img_array, conf=conf_threshold, iou=0.45, agnostic_nms=True)
        return results[0]

inference_service = InferenceService()
