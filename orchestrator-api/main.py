from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <--- IMPORTANTE
from routes import llm
import uvicorn

app = FastAPI(
    title="LA Neighborhood Orchestrator",
    description="API para recomendar barrios de Los Angeles",
    version="1.0.0"
)

# --- CONFIGURACIÓN CORS (CRUCIAL PARA QUE EL FRONTEND SE CONECTE) ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://79.143.89.115:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Permitir estos orígenes
    allow_credentials=True,
    allow_methods=["*"],   # Permitir todos los métodos (GET, POST, OPTIONS...)
    allow_headers=["*"],   # Permitir todos los headers
)
# ------------------------------------------------------------------

# Registrar rutas
app.include_router(llm.router, prefix="/api/llm", tags=["LLM"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Orchestrator API is running 🚀"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)