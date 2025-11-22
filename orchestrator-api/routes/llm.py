from fastapi import APIRouter, HTTPException, status
from schemas.chat import ChatRequest, ChatResponse, Metrics
from services.llm_service import LLMService

router = APIRouter()
llm_service = LLMService()

@router.post("/parametrize", response_model=Metrics)
async def parametrize_request(request: ChatRequest):
    try:
        metrics_dict = await llm_service.analyze_requirements(request.prompt)
        return Metrics(**metrics_dict)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )