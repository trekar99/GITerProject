import re

def clean_user_input(text: str) -> str:
    if not text:
        return ""
    
    # Reemplazar múltiples espacios o tabs por un solo espacio
    text = re.sub(r'\s+', ' ', text)
    
    # Eliminar espacios al principio y final
    text = text.strip()
    
    return text