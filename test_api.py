import time
import requests
import numpy as np
from PIL import Image
import io

print("Creating fake image...")
# Create a blank image
img = Image.new('RGB', (1000, 1000), color = 'red')
buf = io.BytesIO()
img.save(buf, format='JPEG')
buf.seek(0)

print("Sending request to API...")
start = time.time()
try:
    res = requests.post("http://localhost:8000/api/detect", files={"file": ("test.jpg", buf, "image/jpeg")}, timeout=10)
    print(f"Status: {res.status_code}")
    print(res.json())
except Exception as e:
    print(f"Error: {e}")
print(f"Time taken: {time.time() - start:.2f} seconds")
