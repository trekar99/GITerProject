import json
import os
from pathlib import Path

from clients.gemini_client import GeminiClient
from utils.prompt_loader import load_prompt_template
from utils.text_cleaner import clean_user_input

class LLMService:
    def __init__(self):
        self.gemini_client = GeminiClient()

    # Consulta simple al llm
    async def get_response(self, prompt: str) -> str:
        clean_prompt = clean_user_input(prompt)
        return await self.gemini_client.generate_content(clean_prompt)

    # Parametriza los requerimientos del cliente en función de plain text
    async def analyze_requirements(self, user_text: str) -> dict:
        clean_text = clean_user_input(user_text)
        prompt_template = load_prompt_template("parametrize")
        
        if not prompt_template:
            return {"error": "Prompt template not found"}

        # Reemplazamos el marcador __USER_TEXT__ con el contexto del usuario
        system_instruction = prompt_template.format(text=clean_text)

        raw_response = await self.gemini_client.generate_content(system_instruction)
        
        clean_response = raw_response.replace("```json", "").replace("```", "").strip()
        
        try:
            return json.loads(clean_response)
        except json.JSONDecodeError:
            print(f"Error parseando JSON del LLM: {clean_response}")
            return {"precio": 5, "rural": 5, "ocio": 5, "seguridad": 5}