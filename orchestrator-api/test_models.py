import google.generativeai as genai
from core.config import get_settings

settings = get_settings()

genai.configure(api_key=settings.GEMINI_API_KEY)

models = genai.list_models()

for m in models:
    print(m.name, m.supported_generation_methods)
