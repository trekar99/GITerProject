from transformers import pipeline

from utils.text_cleaner import clean_user_input
from utils.formatters import to_int_0_10

class ClassifierService:
    def __init__(self):
        print("Inicializando ClassifierService: cargando modelo multilingüe...")

        self.classifier = pipeline(
            "zero-shot-classification",
            model="./models/mdeberta-mnli",
            tokenizer="./models/mdeberta-mnli",
            device_map="auto"
        )

        # Labels naturales en español (mejor comprensión del modelo multilingüe)
        self.labels = [
            "vida nocturna y social",
            "seguridad y tranquilidad",
            "naturaleza y aire libre",
            "lujo y exclusividad",
            "conectividad y servicios"
        ]

    def parametrize_text(self, user_text: str) -> dict:
        clean_text = clean_user_input(user_text)

        result = self.classifier(
            clean_text,
            self.labels,
            multi_label=True
        )

        # Mapea label → score decimal
        raw_scores = {label: score for label, score in zip(result["labels"], result["scores"])}

        return {
            "nightlife_social": to_int_0_10(raw_scores.get("vida nocturna y social", 0.0)),
            "security_tranquility": to_int_0_10(raw_scores.get("seguridad y tranquilidad", 0.0)),
            "nature_outdoors": to_int_0_10(raw_scores.get("naturaleza y aire libre", 0.0)),
            "luxury_exclusivity": to_int_0_10(raw_scores.get("lujo y exclusividad", 0.0)),
            "connectivity_services": to_int_0_10(raw_scores.get("conectividad y servicios", 0.0))
        }
