from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import numpy as np
import cv2
from PIL import Image
import io
import time
import json
import logging
from pydantic import BaseModel
from typing import Dict, List, Optional, Union

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Threat Detection ML Service")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model cache
MODEL_CACHE = {}

class DetectionResult(BaseModel):
    class_id: int
    class_name: str
    confidence: float
    bbox: List[float]  # [x1, y1, x2, y2]
    is_threat: bool

class AnalysisResponse(BaseModel):
    timestamp: float
    frame_id: str
    detections: List[DetectionResult]
    threat_detected: bool
    processing_time_ms: float

def get_model():
    """Load or retrieve model from cache"""
    if "detection_model" not in MODEL_CACHE:
        logger.info("Loading YOLOv8 model...")
        try:
            # In a real implementation, this would load the actual model
            # MODEL_CACHE["detection_model"] = torch.hub.load('ultralytics/yolov8', 'yolov8s')
            
            # For this example, we'll simulate the model
            class MockModel:
                def __call__(self, img):
                    time.sleep(0.1)  # Simulate processing time
                    return MockResults()
            
            class MockResults:
                def pandas(self):
                    return MockPandas()
            
            class MockPandas:
                @property
                def xyxy(self):
                    # Simulate detection results
                    return [self._generate_mock_detections()]
                
                def _generate_mock_detections(self):
                    import pandas as pd
                    # Create a DataFrame with mock detection results
                    return pd.DataFrame({
                        'xmin': [100, 200, 300],
                        'ymin': [100, 150, 200],
                        'xmax': [150, 250, 350],
                        'ymax': [150, 200, 250],
                        'confidence': [0.92, 0.85, 0.76],
                        'class': [0, 1, 2],
                        'name': ['person', 'car', 'suspicious_object']
                    })
            
            MODEL_CACHE["detection_model"] = MockModel()
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise HTTPException(status_code=500, detail="Failed to load ML model")
    
    return MODEL_CACHE["detection_model"]

def is_threat(class_name: str, confidence: float) -> bool:
    """Determine if a detection is a potential threat"""
    threat_classes = {"suspicious_object", "weapon", "fire", "smoke"}
    if class_name in threat_classes and confidence > 0.7:
        return True
    return False

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": time.time()}

@app.post("/detect", response_model=AnalysisResponse)
async def detect_objects(file: UploadFile = File(...)):
    """Detect objects in the uploaded image and identify potential threats"""
    start_time = time.time()
    
    try:
        # Read image data
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Get model and run inference
        model = get_model()
        results = model(image)
        
        # Process results
        df_results = results.pandas().xyxy[0]
        
        detections = []
        threat_detected = False
        
        for _, row in df_results.iterrows():
            detection = DetectionResult(
                class_id=int(row['class']),
                class_name=row['name'],
                confidence=float(row['confidence']),
                bbox=[
                    float(row['xmin']), 
                    float(row['ymin']), 
                    float(row['xmax']), 
                    float(row['ymax'])
                ],
                is_threat=is_threat(row['name'], float(row['confidence']))
            )
            
            if detection.is_threat:
                threat_detected = True
                logger.warning(f"Threat detected: {detection.class_name} with confidence {detection.confidence}")
            
            detections.append(detection)
        
        processing_time = (time.time() - start_time) * 1000  # Convert to ms
        
        return AnalysisResponse(
            timestamp=time.time(),
            frame_id=file.filename or str(int(time.time())),
            detections=detections,
            threat_detected=threat_detected,
            processing_time_ms=processing_time
        )
        
    except Exception as e:
        logger.error(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
