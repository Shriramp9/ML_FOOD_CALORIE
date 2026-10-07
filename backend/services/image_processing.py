import cv2
import numpy as np

def enhance_image(img_array):
    # img_array is RGB (from PIL). YOLO also expects RGB.
    # Return the image exactly as it is without artificial sharpening, 
    # which introduces artifacts that confuse YOLO.
    return img_array

def detect_plate(img_array):
    gray    = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    blurred = cv2.GaussianBlur(gray, (9, 9), 2)
    circles = cv2.HoughCircles(
        blurred, cv2.HOUGH_GRADIENT,
        dp=1.2, minDist=100,
        param1=50, param2=30,
        minRadius=80, maxRadius=400
    )
    if circles is not None:
        circles = np.round(circles[0, :]).astype("int")
        return max(circles, key=lambda c: c[2])
    return None

def estimate_portion(box, img_w, img_h, plate_circle=None):
    x1, y1, x2, y2 = box

    ratio = ((x2-x1) * (y2-y1)) / (img_w * img_h)
    
    # If the food takes up very little of the image, it's a small portion.
    # If it takes up most of the image, it's a large portion.
    if ratio < 0.15:
        return 0.5, "Small (0.5 portion)"
    elif ratio < 0.60:
        return 1.0, "Regular (1 portion)"
    else:
        return 1.5, "Large (1.5 portions)"
