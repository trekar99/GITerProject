from fastapi import APIRouter, HTTPException, status
from schemas.chat import Metrics
from services.recommendation_service import RecommendationService

router = APIRouter()

recommender = RecommendationService(csv_path="../../model_data.csv")

@router.post("/recommend")
async def recommend_from_metrics(metrics: Metrics):
    result = recommender.recommend(metrics.model_dump())
    return result