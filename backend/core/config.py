import os

class Settings:
    APP_NAME: str = "Food Calorie API"
    YOLO_MODEL_PATH: str = "yolov8m.pt"
    CUSTOM_MODEL_PATH: str = "runs/detect/train/weights/best.pt"
    CSV_DB_PATH: str = "food_calories.csv"
    
    def get_model_path(self):
        if os.path.exists(self.CUSTOM_MODEL_PATH):
            return self.CUSTOM_MODEL_PATH
        if os.path.exists(self.YOLO_MODEL_PATH):
            return self.YOLO_MODEL_PATH
        return "yolov8s-world.pt"

settings = Settings()
