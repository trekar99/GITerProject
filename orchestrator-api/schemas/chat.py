from pydantic import BaseModel, Field
from typing import Any

class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    response: str

class JustifyRequest(BaseModel):
    text: Any

class Metrics(BaseModel):
    nightlife_social: float = Field(..., ge=0, le=10, description="Nivel de vida nocturna / social (0-10)")
    security_tranquility: float = Field(..., ge=0, le=10, description="Nivel de seguridad (0-10)")
    nature_outdoors: float = Field(..., ge=0, le=10, description="Naturaleza y aire libre (0-10)")
    luxury_exclusivity: float = Field(..., ge=0, le=10, description="Lujo y exclusividad (0-10)")
    connectivity_services: float = Field(..., ge=0, le=10, description="Conectividad y servicios (0-10)")