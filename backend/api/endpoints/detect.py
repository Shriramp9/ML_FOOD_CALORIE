from fastapi import APIRouter, File, UploadFile, HTTPException
import io
from PIL import Image
import numpy as np

from backend.schemas.food import DetectionResponse, DetectedFood
from backend.services.image_processing import enhance_image, detect_plate, estimate_portion
from backend.services.inference import inference_service
from backend.services.nutrition import nutrition_service, get_emoji, get_color

router = APIRouter()

# Map COCO class names → food_calories.csv food names
COCO_FOOD_MAP = {
    "pizza":      "pizza",
    "sandwich":   "burger",     # COCO "sandwich" visually = burger
    "hot dog":    "hot dog",
    "cake":       "cake",
    "donut":      "donut",
    "carrot":     "carrot",
    "broccoli":   "broccoli",
    "banana":     "banana",
    "apple":      "apple",
    "orange":     "orange",
    "bowl":       "soup",
    "cup":        "coffee",
    "wine glass": "wine",
    "bottle":     "juice",
    "corn":       "corn",
    "rice":       "rice",
    "salad":      "salad",
}

@router.post("/detect", response_model=DetectionResponse)
async def detect_food(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image.thumbnail((640, 640))
        
        img_array = np.array(image)
        img_array = enhance_image(img_array)
        img_h, img_w = img_array.shape[:2]

        plate_circle = detect_plate(img_array)

        # Pass the PIL image directly. Passing np.array(image) causes YOLO to assume BGR,
        # which swaps the red and blue channels and breaks detection.
        result = inference_service.predict(image)

        labels = [result.names[int(c)] for c in result.boxes.cls]
        confs  = [float(x) for x in result.boxes.conf]
        boxes  = result.boxes.xyxy.tolist()

        detected_foods_raw = []
        for label, conf, box in zip(labels, confs, boxes):
            csv_food = COCO_FOOD_MAP.get(label.lower())
            if csv_food is not None:
                detected_foods_raw.append((csv_food, conf, box))

        # Fallback: if no food is detected at default confidence (0.25), try again at 0.10
        if not detected_foods_raw:
            fallback_result = inference_service.predict(image, conf_threshold=0.10)
            f_labels = [fallback_result.names[int(c)] for c in fallback_result.boxes.cls]
            f_confs  = [float(x) for x in fallback_result.boxes.conf]
            f_boxes  = fallback_result.boxes.xyxy.tolist()
            
            for label, conf, box in zip(f_labels, f_confs, f_boxes):
                csv_food = COCO_FOOD_MAP.get(label.lower())
                if csv_food is not None:
                    detected_foods_raw.append((csv_food, conf, box))

        detected_foods = []
        item_id = 1

        for csv_food, conf, box in detected_foods_raw:
            pf, plabel = estimate_portion(box, img_w, img_h, plate_circle)
            nutrients = nutrition_service.get_nutrition(csv_food, pf)
            display_name = csv_food.replace("_", " ").title()

            detected_foods.append(DetectedFood(
                id=item_id,
                name=display_name,
                portion=plabel,
                calories=nutrients["calories"],
                protein=nutrients["protein"],
                carbs=nutrients["carbs"],
                fat=nutrients["fat"],
                emoji=get_emoji(csv_food),
                color=get_color(csv_food),
                confidence=int(conf * 100)
            ))
            item_id += 1

        return DetectionResponse(items=detected_foods)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
