from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    response: str

class Metrics(BaseModel):
    luxury: int = Field(..., ge=0, le=10, description="Nivel de lujo (0-10)")
    safety: int = Field(..., ge=0, le=10, description="Nivel de seguridad (0-10)")
    nature: int = Field(..., ge=0, le=10, description="Nivel de naturaleza cercana (0-10)")
    nightlife: int = Field(..., ge=0, le=10, description="Nivel de vida nocturna (0-10)")
    mobility: int = Field(..., ge=0, le=10, description="Nivel de movilidad y transporte (0-10)")