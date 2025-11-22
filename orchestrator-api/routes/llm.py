from fastapi import APIRouter, HTTPException, status
from schemas.chat import ChatRequest, Metrics
# Importamos el nuevo servicio
from services.classifier_service import ClassifierService
# Mantenemos el antiguo servicio por si usas el chat en otro endpoint
from services.llm_service import LLMService

router = APIRouter()

# Instanciamos ambos servicios
llm_service = LLMService()
classifier_service = ClassifierService()

@router.post("/parametrize", response_model=Metrics)
def parametrize_request(request: ChatRequest):
    """
    Endpoint síncrono (def) para permitir que FastAPI ejecute 
    el modelo de HuggingFace en un thread separado sin bloquear el servidor.
    """
    try:
        # Llamada al nuevo servicio local
        metrics_dict = classifier_service.parametrize_text(request.prompt)
        return Metrics(**metrics_dict)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )