from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.endpoints import detect, federated
from backend.services.inference import inference_service

app = FastAPI(title="Food Calorie API (Modular)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detect.router, prefix="/api", tags=["detect"])
app.include_router(federated.router, prefix="/api/federated", tags=["federated"])
