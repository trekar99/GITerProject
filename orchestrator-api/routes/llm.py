import json
from fastapi import APIRouter, HTTPException, status
from services.llm_service import LLMService
from schemas.chat import JustifyRequest

router = APIRouter()

llm_service = LLMService()

@router.post("/justify-results")
async def justify_results(payload: JustifyRequest):
    try:
        text = json.dumps(payload.text)
        result = await llm_service.justify_result(text)
        return {"justification": result}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generando la justificación: {str(e)}"
        )
