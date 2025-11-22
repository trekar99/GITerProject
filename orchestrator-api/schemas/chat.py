from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    response: str

class Metrics(BaseModel):
    precio: int = Field(..., ge=0, le=10, description="Nivel de precio (0-10)")
    rural: int = Field(..., ge=0, le=10, description="Nivel de entorno rural (0-10)")
    ocio: int = Field(..., ge=0, le=10, description="Importancia del ocio (0-10)")
    seguridad: int = Field(..., ge=0, le=10, description="Importancia de la seguridad (0-10)")