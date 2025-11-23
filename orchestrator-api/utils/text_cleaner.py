import re

def clean_user_input(text: str) -> str:
    if not text:
        return ""
    
    text = re.sub(r'\s+', ' ', text)
    
    text = text.strip()
    
    return text