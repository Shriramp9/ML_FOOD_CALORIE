from ultralytics import YOLO

if __name__ == '__main__':
    # Load model
    model = YOLO('yolov8s.pt')
    
    # Train the model
    # Note: Training locally on CPU will take a very long time for 100 epochs.
    # You can reduce the epochs if you just want to test it out.
    results = model.train(
        data='dataset/dataset.yaml',
        epochs=100,
        batch=8,
        imgsz=640
    )
