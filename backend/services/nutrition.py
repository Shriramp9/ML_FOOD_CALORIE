import pandas as pd
from backend.core.config import settings
import os

class NutritionService:
    def __init__(self):
        if os.path.exists(settings.CSV_DB_PATH):
            self.df = pd.read_csv(settings.CSV_DB_PATH)
        else:
            self.df = pd.DataFrame(columns=["food", "calories_per_100g", "serving_size_g", "calories_per_serving", "protein_g", "carbs_g", "fat_g"])

    def get_nutrition(self, food_name: str, portion_factor: float):
        search_name = food_name.lower().replace("_", " ")
        match = self.df[self.df["food"].str.lower() == search_name]
        
        if match.empty:
            match = self.df[self.df["food"].str.lower() == food_name.lower()]
            
        if not match.empty:
            row = match.iloc[0]
            cal = round(float(row["calories_per_serving"]) * portion_factor, 1)
            pro = round(float(row["protein_g"]) * portion_factor, 1)
            carb = round(float(row["carbs_g"]) * portion_factor, 1)
            fat = round(float(row["fat_g"]) * portion_factor, 1)
            return {
                "calories": cal,
                "protein": pro,
                "carbs": carb,
                "fat": fat
            }
        
        # Fallback default values
        return {
            "calories": round(200.0 * portion_factor, 1),
            "protein": round(10.0 * portion_factor, 1),
            "carbs": round(20.0 * portion_factor, 1),
            "fat": round(5.0 * portion_factor, 1)
        }

nutrition_service = NutritionService()

def get_emoji(food_name: str):
    emojis = {
        "pizza": "🍕", "apple": "🍎", "banana": "🍌", "orange": "🍊",
        "sandwich": "🥪", "hot dog": "🌭", "cake": "🍰", "donut": "🍩",
        "carrot": "🥕", "broccoli": "🥦", "wine": "🍷", "coffee": "☕",
        "soup": "🥣", "juice": "🧃", "burger": "🍔", "salad": "🥗",
        "rice": "🍚", "corn": "🌽", "chicken": "🍗", "steak": "🥩",
        "drink": "🥤", "fruits": "🍓", "eggs": "🥚", "pasta": "🍝",
        "sweet item": "🧁", "snack item": "🍘", "fish dish": "🐟",
        "fried chicken": "🍗", "french fries": "🍟", "curry dish": "🍛",
        "rice dish": "🍛", "dry vegetable": "🥗", "accompaniment": "🥣",
        "dal or sambar": "🥣", "south indian breakfast": "🥞",
        "bread or roti naan": "🫓", "chow mein": "🍜", "fried rice": "🍚",
        "chinese sausage": "🌭", "mozza burger": "🍔", "cheese burger": "🍔",
        "nugget": "🍗", "chicken nuggets": "🍗", "water spinach": "🥬",
        "chinese cabbage": "🥬", "super greens": "🥬", "aw cola": "🥤",
        "sprite": "🥤", "crispy corn": "🌽"
    }
    search_name = food_name.lower().replace("_", " ")
    return emojis.get(search_name, "🍽️")

def get_color(food_name: str):
    return "#00E5A0" # Default color, can be enhanced later
