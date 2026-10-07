import pandas as pd

# Load existing DB
db_path = "food_calories.csv"
try:
    df = pd.read_csv(db_path)
except FileNotFoundError:
    df = pd.DataFrame(columns=["food", "calories_per_100g", "serving_size_g", "calories_per_serving", "protein_g", "carbs_g", "fat_g"])

new_foods = [
    # dataset.yaml (16 classes)
    {"food": "bread_or_Roti_naan", "calories_per_100g": 297, "serving_size_g": 100, "calories_per_serving": 297, "protein_g": 9, "carbs_g": 50, "fat_g": 4},
    {"food": "curry_dish", "calories_per_100g": 150, "serving_size_g": 200, "calories_per_serving": 300, "protein_g": 10, "carbs_g": 15, "fat_g": 20},
    {"food": "rice_dish", "calories_per_100g": 130, "serving_size_g": 200, "calories_per_serving": 260, "protein_g": 3, "carbs_g": 28, "fat_g": 1},
    {"food": "dry_vegetable", "calories_per_100g": 80, "serving_size_g": 150, "calories_per_serving": 120, "protein_g": 2, "carbs_g": 10, "fat_g": 5},
    {"food": "snack_item", "calories_per_100g": 400, "serving_size_g": 50, "calories_per_serving": 200, "protein_g": 5, "carbs_g": 50, "fat_g": 20},
    {"food": "sweet_item", "calories_per_100g": 350, "serving_size_g": 50, "calories_per_serving": 175, "protein_g": 3, "carbs_g": 60, "fat_g": 10},
    {"food": "accompaniment", "calories_per_100g": 50, "serving_size_g": 50, "calories_per_serving": 25, "protein_g": 1, "carbs_g": 5, "fat_g": 0},
    {"food": "Dal_or_sambar", "calories_per_100g": 100, "serving_size_g": 200, "calories_per_serving": 200, "protein_g": 8, "carbs_g": 15, "fat_g": 3},
    {"food": "drink", "calories_per_100g": 40, "serving_size_g": 250, "calories_per_serving": 100, "protein_g": 0, "carbs_g": 10, "fat_g": 0},
    {"food": "eggs", "calories_per_100g": 155, "serving_size_g": 100, "calories_per_serving": 155, "protein_g": 13, "carbs_g": 1, "fat_g": 11},
    {"food": "fish_dish", "calories_per_100g": 200, "serving_size_g": 150, "calories_per_serving": 300, "protein_g": 20, "carbs_g": 5, "fat_g": 10},
    {"food": "fruits", "calories_per_100g": 50, "serving_size_g": 150, "calories_per_serving": 75, "protein_g": 1, "carbs_g": 15, "fat_g": 0},
    {"food": "pasta", "calories_per_100g": 130, "serving_size_g": 200, "calories_per_serving": 260, "protein_g": 5, "carbs_g": 25, "fat_g": 1},
    {"food": "salad", "calories_per_100g": 20, "serving_size_g": 150, "calories_per_serving": 30, "protein_g": 1, "carbs_g": 5, "fat_g": 0},
    {"food": "soup", "calories_per_100g": 45, "serving_size_g": 200, "calories_per_serving": 90, "protein_g": 2, "carbs_g": 10, "fat_g": 1},
    {"food": "south_indian_breakfast", "calories_per_100g": 150, "serving_size_g": 200, "calories_per_serving": 300, "protein_g": 5, "carbs_g": 30, "fat_g": 5},
    
    # data.yaml (36 classes)
    {"food": "AW cola", "calories_per_100g": 45, "serving_size_g": 330, "calories_per_serving": 150, "protein_g": 0, "carbs_g": 39, "fat_g": 0},
    {"food": "Beijing Beef", "calories_per_100g": 250, "serving_size_g": 150, "calories_per_serving": 375, "protein_g": 15, "carbs_g": 25, "fat_g": 18},
    {"food": "Chow Mein", "calories_per_100g": 150, "serving_size_g": 200, "calories_per_serving": 300, "protein_g": 5, "carbs_g": 40, "fat_g": 10},
    {"food": "Fried Rice", "calories_per_100g": 160, "serving_size_g": 200, "calories_per_serving": 320, "protein_g": 6, "carbs_g": 42, "fat_g": 12},
    {"food": "Hashbrown", "calories_per_100g": 250, "serving_size_g": 100, "calories_per_serving": 250, "protein_g": 2, "carbs_g": 30, "fat_g": 15},
    {"food": "Honey Walnut Shrimp", "calories_per_100g": 300, "serving_size_g": 150, "calories_per_serving": 450, "protein_g": 12, "carbs_g": 30, "fat_g": 25},
    {"food": "Kung Pao Chicken", "calories_per_100g": 200, "serving_size_g": 150, "calories_per_serving": 300, "protein_g": 15, "carbs_g": 10, "fat_g": 18},
    {"food": "String Bean Chicken Breast", "calories_per_100g": 110, "serving_size_g": 150, "calories_per_serving": 165, "protein_g": 12, "carbs_g": 10, "fat_g": 8},
    {"food": "Super Greens", "calories_per_100g": 50, "serving_size_g": 100, "calories_per_serving": 50, "protein_g": 3, "carbs_g": 6, "fat_g": 2},
    {"food": "The Original Orange Chicken", "calories_per_100g": 250, "serving_size_g": 150, "calories_per_serving": 375, "protein_g": 14, "carbs_g": 35, "fat_g": 18},
    {"food": "White Steamed Rice", "calories_per_100g": 130, "serving_size_g": 200, "calories_per_serving": 260, "protein_g": 3, "carbs_g": 28, "fat_g": 0},
    {"food": "black pepper rice bowl", "calories_per_100g": 180, "serving_size_g": 250, "calories_per_serving": 450, "protein_g": 15, "carbs_g": 45, "fat_g": 15},
    {"food": "burger", "calories_per_100g": 295, "serving_size_g": 200, "calories_per_serving": 590, "protein_g": 17, "carbs_g": 24, "fat_g": 14},
    {"food": "carrot_eggs", "calories_per_100g": 120, "serving_size_g": 150, "calories_per_serving": 180, "protein_g": 8, "carbs_g": 10, "fat_g": 10},
    {"food": "cheese burger", "calories_per_100g": 300, "serving_size_g": 200, "calories_per_serving": 600, "protein_g": 18, "carbs_g": 25, "fat_g": 16},
    {"food": "chicken waffle", "calories_per_100g": 350, "serving_size_g": 200, "calories_per_serving": 700, "protein_g": 20, "carbs_g": 50, "fat_g": 30},
    {"food": "chicken_nuggets", "calories_per_100g": 296, "serving_size_g": 100, "calories_per_serving": 296, "protein_g": 15, "carbs_g": 15, "fat_g": 20},
    {"food": "chinese_cabbage", "calories_per_100g": 16, "serving_size_g": 100, "calories_per_serving": 16, "protein_g": 1, "carbs_g": 3, "fat_g": 0},
    {"food": "chinese_sausage", "calories_per_100g": 600, "serving_size_g": 50, "calories_per_serving": 300, "protein_g": 10, "carbs_g": 5, "fat_g": 25},
    {"food": "crispy corn", "calories_per_100g": 150, "serving_size_g": 100, "calories_per_serving": 150, "protein_g": 3, "carbs_g": 20, "fat_g": 5},
    {"food": "curry", "calories_per_100g": 150, "serving_size_g": 200, "calories_per_serving": 300, "protein_g": 10, "carbs_g": 15, "fat_g": 20},
    {"food": "french fries", "calories_per_100g": 312, "serving_size_g": 100, "calories_per_serving": 312, "protein_g": 3, "carbs_g": 41, "fat_g": 15},
    {"food": "fried chicken", "calories_per_100g": 250, "serving_size_g": 150, "calories_per_serving": 375, "protein_g": 15, "carbs_g": 10, "fat_g": 20},
    {"food": "fried_chicken", "calories_per_100g": 250, "serving_size_g": 150, "calories_per_serving": 375, "protein_g": 15, "carbs_g": 10, "fat_g": 20},
    {"food": "fried_dumplings", "calories_per_100g": 200, "serving_size_g": 150, "calories_per_serving": 300, "protein_g": 8, "carbs_g": 25, "fat_g": 15},
    {"food": "fried_eggs", "calories_per_100g": 196, "serving_size_g": 100, "calories_per_serving": 196, "protein_g": 13, "carbs_g": 1, "fat_g": 15},
    {"food": "mango chicken pocket", "calories_per_100g": 220, "serving_size_g": 150, "calories_per_serving": 330, "protein_g": 10, "carbs_g": 30, "fat_g": 15},
    {"food": "mozza burger", "calories_per_100g": 320, "serving_size_g": 200, "calories_per_serving": 640, "protein_g": 20, "carbs_g": 25, "fat_g": 18},
    {"food": "mung_bean_sprouts", "calories_per_100g": 30, "serving_size_g": 100, "calories_per_serving": 30, "protein_g": 3, "carbs_g": 6, "fat_g": 0},
    {"food": "nugget", "calories_per_100g": 296, "serving_size_g": 100, "calories_per_serving": 296, "protein_g": 15, "carbs_g": 15, "fat_g": 20},
    {"food": "perkedel", "calories_per_100g": 180, "serving_size_g": 100, "calories_per_serving": 180, "protein_g": 4, "carbs_g": 20, "fat_g": 10},
    {"food": "rice", "calories_per_100g": 130, "serving_size_g": 200, "calories_per_serving": 260, "protein_g": 3, "carbs_g": 28, "fat_g": 0},
    {"food": "sprite", "calories_per_100g": 40, "serving_size_g": 330, "calories_per_serving": 132, "protein_g": 0, "carbs_g": 33, "fat_g": 0},
    {"food": "tostitos cheese dip sauce", "calories_per_100g": 250, "serving_size_g": 50, "calories_per_serving": 125, "protein_g": 3, "carbs_g": 5, "fat_g": 10},
    {"food": "triangle_hash_brown", "calories_per_100g": 250, "serving_size_g": 100, "calories_per_serving": 250, "protein_g": 2, "carbs_g": 30, "fat_g": 15},
    {"food": "water_spinach", "calories_per_100g": 20, "serving_size_g": 100, "calories_per_serving": 20, "protein_g": 2, "carbs_g": 3, "fat_g": 0}
]

# Convert to DataFrame
new_df = pd.DataFrame(new_foods)

# Filter out foods that already exist (case-insensitive)
existing_foods = df["food"].str.lower().tolist()
filtered_new_df = new_df[~new_df["food"].str.lower().isin(existing_foods)]

if not filtered_new_df.empty:
    df = pd.concat([df, filtered_new_df], ignore_index=True)
    df.to_csv(db_path, index=False)
    print(f"Added {len(filtered_new_df)} new items to {db_path}")
else:
    print("No new items needed to be added.")
