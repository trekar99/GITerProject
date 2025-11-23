from fastapi import APIRouter, HTTPException, status
from schemas.chat import ChatRequest, Metrics
from services.classifier_service import ClassifierService

router = APIRouter()

# Instanciamos ambos servicios
classifier_service = ClassifierService()

@router.post("/parametrize", response_model=Metrics)
def parametrize_request(request: ChatRequest):
    try:
        metrics_dict = classifier_service.parametrize_text(request.prompt)
        return Metrics(**metrics_dict)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )