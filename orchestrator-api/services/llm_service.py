import json
import os
from pathlib import Path

from clients.gemini_client import GeminiClient
from utils.prompt_loader import load_prompt_template
from utils.text_cleaner import clean_user_input

class LLMService:
    def __init__(self):
        self.gemini_client = GeminiClient()

    async def justify_result(self, json_result: str) -> str:
        prompt_template = load_prompt_template("justify-prompt")

        if not prompt_template:
            return "Error: Prompt template not found."

        try:
            system_instruction = prompt_template.format(text=json_result)
            response = await self.gemini_client.generate_content(system_instruction)
            response.replace("\n", "") # Elimina el '\n' final porque es retrasado y no hace caso

            return response

        except json.JSONDecodeError:
            return "Error: No se pudo procesar la justificación generada."