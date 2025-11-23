from pathlib import Path


def load_prompt_template(prompt) -> str:
    try:
        current_dir = Path(__file__).parent
        prompt_path = current_dir.parent / "prompts" / f"{prompt}.md"
        
        with open(prompt_path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        print(f"ADVERTENCIA: No se encontró el prompt en {prompt_path}")
        return ""