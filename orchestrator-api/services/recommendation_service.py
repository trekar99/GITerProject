import pandas as pd

class RecommendationService:
    def __init__(self, csv_path: str):
        self.df = pd.read_csv(csv_path)

        # Diccionario Maestro: Concepto Humano -> Columnas Técnicas
        self.TAXONOMIA = {
            "nightlife_social": ["densidad_bares", "num_restaurantes", "clubs"],
            "security_tranquility": ["ruido_db_inverso", "trafico_bajo", "seguridad"],
            "luxury_exclusivity": ["precio_vivienda", "renta_per_capita"],
            "nature_outdoors": ["metros_parques", "arboles_calle", "calidad_aire"],
            "connectivity_services": ["velocidad_fibra", "coworkings", "transporte_rapido"]
        }

    def recommend(self, metrics: dict, umbral: float = 0.20):
        # Normalizar a 0–1
        normalized = {k: v / 10 for k, v in metrics.items()}

        # Añadir columna de score acumulado
        df = self.df.copy()
        df["score_final"] = 0.0

        justificaciones = []

        for concepto, peso in normalized.items():

            # descartar intereses muy débiles
            if peso < umbral:
                continue

            columnas = self.TAXONOMIA.get(concepto, [])

            # Guardar razones (para frontend)
            justificaciones.append(
                f"{concepto.replace('_',' ').capitalize()} ({int(peso*100)}%)"
            )

            # Sumar ponderaciones
            for col in columnas:
                if col in df.columns:
                    df["score_final"] += df[col] * peso

        # Orden final
        top = df.sort_values("score_final", ascending=False).iloc[0]

        return {
            "barrio": top["nombre"],
            "score": round(float(top["score_final"]), 4),
            "justificaciones": justificaciones
        }
