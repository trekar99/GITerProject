import json
import pandas as pd

CSV_PATH = "./data/model_data.csv"
TAXONOMY_PATH = "./data/taxonomy.json"
MAP_PARAMETERS_PATH = "./data/map_parameters.json"


class RecommendationService:
    def __init__(
        self,
        csv_path: str = CSV_PATH,
        taxonomy_path: str = TAXONOMY_PATH,
        map_parameters_path: str = MAP_PARAMETERS_PATH
    ):
        self.df = pd.read_csv(csv_path, sep=";")

        with open(taxonomy_path, "r", encoding="utf-8") as f:
            self.TAXONOMIA = json.load(f)["TAXONOMIA"]

        with open(map_parameters_path, "r", encoding="utf-8") as f:
            self.MAP = json.load(f)["MAP_PARAMETERS"]

    def recommend(self, metrics: dict, umbral: float = 0.20):
        normalized = {k: v / 10 for k, v in metrics.items()}

        df = self.df.copy()
        df["score_final"] = 0.0

        # Para guardar aportes columna a columna
        aportes_por_barrio = {i: {} for i in df.index}

        for metric_key, peso in normalized.items():

            if peso < umbral:
                continue

            concepto_humano = self.MAP[metric_key]
            columnas = self.TAXONOMIA.get(concepto_humano, [])

            for col in columnas:
                if col not in df.columns:
                    continue

                # Suma al score total
                df["score_final"] += df[col] * peso

                # Guardar aportes individualmente
                for idx, valor_barrio in df[col].items():
                    aporte = valor_barrio * peso
                    aportes_por_barrio[idx][col] = aporte

        sorted_values = df.sort_values("score_final", ascending=False).head(5)
        results = []

        for idx, row in sorted_values.iterrows():
            # ordenar aportes por peso
            aportes = aportes_por_barrio[idx]
            aportes_ordenados = sorted(
                [
                    {
                        "feature": col,
                        "neighbour_value": round(float(df.loc[idx, col]), 3),
                        "parameter_weight": round(float(metrics[key] / 10), 3),
                        "contribution": round(float(apor), 3)
                    }
                    for col, apor in aportes.items()
                    for key, mapped in self.MAP.items()
                    if col in self.TAXONOMIA.get(mapped, [])
                ],
                key=lambda x: x["contribution"],
                reverse=True
            )

            results.append({
                "barrio": row["Neighborhood"],
                "score": round(float(row["score_final"]), 4),
                "justificaciones": aportes_ordenados[:5]  # top 5 razones del barrio
            })

        return results
