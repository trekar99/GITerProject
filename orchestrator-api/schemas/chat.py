from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    response: str

class Metrics(BaseModel):
    nightlife_social: int = Field(..., ge=0, le=10, description="Nivel de vida nocturna / social (0-10)")
    security_tranquility: int = Field(..., ge=0, le=10, description="Nivel de seguridad (0-10)")
    nature_outdoors: int = Field(..., ge=0, le=10, description="Naturaleza y aire libre (0-10)")
    luxury_exclusivity: int = Field(..., ge=0, le=10, description="Lujo y exclusividad (0-10)")
    connectivity_services: int = Field(..., ge=0, le=10, description="Conectividad y servicios (0-10)")