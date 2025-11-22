from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import get_settings
from middlewares.security import restrict_methods_middleware
from routes import llm

settings = get_settings()

app = FastAPI(title=settings.APP_NAME)
app.middleware("http")(restrict_methods_middleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,   # Lista de dominios externos permitidos
    allow_credentials=True,
    allow_methods=["GET"],                 # SOLO GET desde navegador
    allow_headers=["*"],
)

app.include_router(llm.router, prefix="/llm")

@app.get("/")
def health_check():
    return {"status": "ok", "message": "API encendida correctamente"}