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

    def recommend(self, metrics: dict, umbral: float = 0.15):  # Bajamos un poco el umbral
        # Normalizamos pesos del usuario (0-10 -> 0-1)
        user_weights = {k: v / 10.0 for k, v in metrics.items()}

        df = self.df.copy()
        df["score_final"] = 0.0

        # Diccionario para guardar justificaciones
        aportes_por_barrio = {i: {} for i in df.index}

        # 1. Iteramos por cada métrica que el usuario ha valorado
        for metric_key, user_weight in user_weights.items():

            # Si al usuario no le importa esto (peso bajo), pasamos
            if user_weight < 0.1:
                continue

            concepto_humano = self.MAP[metric_key]
            columnas = self.TAXONOMIA.get(concepto_humano, [])

            if not columnas:
                continue

            # Calculamos el valor promedio de este concepto para cada barrio
            # Ej: Si "Vida Nocturna" son 3 columnas (bares, clubs...), hacemos la media
            df[f"avg_{metric_key}"] = df[columnas].mean(axis=1)

            # 2. MATCHING INTELIGENTE:
            # En lugar de solo sumar (Barrio * Peso), calculamos la similitud.
            # Queremos barrios cuyo valor se acerque al deseo del usuario.
            # Fórmula: 1 - |ValorBarrio - ValorDeseado|
            # Si tú quieres un 8 de fiesta y el barrio tiene un 8, el match es 1.0 (Perfecto).
            # Si tiene un 2, el match es 0.4.

            distancia = abs(df[f"avg_{metric_key}"] - user_weight)
            similitud = 1.0 - distancia

            # Ponderamos por la importancia que le da el usuario
            score_contribution = similitud * user_weight * 5  # Multiplicador para dar peso

            df["score_final"] += score_contribution

            # Guardamos justificaciones (solo si aporta positivo)
            for idx in df.index:
                if score_contribution[idx] > 0.1:
                    # Elegimos la columna más representativa de este grupo para mostrarla
                    best_col = max(columnas, key=lambda c: df.loc[idx, c])
                    aportes_por_barrio[idx][best_col] = score_contribution[idx]

        # 3. PENALIZACIÓN POR PRECIO (Opcional pero recomendado para realismo)
        # Si no has pedido lujo explícitamente, penalizamos los barrios carísimos
        if user_weights.get('luxury_exclusivity', 0) < 0.4:
            if 'Avg_price' in df.columns:
                df["score_final"] -= df['Avg_price'] * 0.5

        # Ordenar y formatear salida
        sorted_values = df.sort_values("score_final", ascending=False).head(5)
        results = []

        for idx, row in sorted_values.iterrows():
            aportes = aportes_por_barrio[idx]

            # Ordenamos las razones por su contribución al score
            aportes_ordenados = sorted(
                [
                    {
                        "feature": col,
                        "neighbour_value": round(float(self.df.loc[idx, col]), 2),  # Valor original
                        "contribution": round(float(apor), 2)
                    }
                    for col, apor in aportes.items()
                ],
                key=lambda x: x["contribution"],
                reverse=True
            )

            results.append({
                "barrio": row["Neighborhood"],
                "score": round(float(row["score_final"]), 2),
                "justificaciones": aportes_ordenados[:3]  # Top 3 razones
            })

        return results
