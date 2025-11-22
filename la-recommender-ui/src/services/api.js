// Importamos el archivo GeoJSON local
import laNeighborhoodsData from '../data/Neighborhood_Councils_(Certified).json';

// URL DE TU BACKEND
const API_URL = 'http://localhost:8000/api/llm';

// Datos estáticos de los barrios (Stats del 0 al 100, así que encajan con la conversión que haremos)
export const MOCK_NEIGHBORHOODS = {
    'echo_park': {
        id: 'echo_park',
        name: 'Echo Park',
        geojsonName: 'ECHO PARK NC',
        description: 'Vida urbana relajada, lago con patos y cafés hipster.',
        stats: { luxury: 40, safety: 60, nature: 80, nightlife: 70, mobility: 60 },
        center: [34.078, -118.260]
    },
    'bel_air': {
        id: 'bel_air',
        name: 'Bel Air - Beverly Crest',
        geojsonName: 'BEL AIR-BEVERLY CREST NC',
        description: 'Privacidad absoluta, mansiones en las colinas y vistas exclusivas.',
        stats: { luxury: 100, safety: 90, nature: 60, nightlife: 20, mobility: 40 },
        center: [34.105, -118.445]
    },
    'venice': {
        id: 'venice',
        name: 'Venice Beach',
        geojsonName: 'VENICE NC',
        description: 'Espíritu libre, canales, playa y arte callejero.',
        stats: { luxury: 70, safety: 60, nature: 90, nightlife: 80, mobility: 70 },
        center: [33.990, -118.465]
    },
    'silver_lake': {
        id: 'silver_lake',
        name: 'Silver Lake',
        geojsonName: 'SILVER LAKE NC',
        description: 'Bohemio, auténtico y comunitario.',
        stats: { luxury: 50, safety: 60, nature: 50, nightlife: 70, mobility: 50 },
        center: [34.090, -118.275]
    }
};

export const SimulatedAPI = {

    // 1. LLAMADA REAL: Texto -> Parámetros (CONVERTIDOS A %)
    parseTextToParams: async (text) => {
        try {
            console.log("Enviando prompt al backend:", text);

            // Usamos 'prompt' porque tu modelo Pydantic ChatRequest lo define así
            const response = await fetch(`${API_URL}/parametrize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text })
            });

            if (!response.ok) throw new Error(`Error Backend: ${response.statusText}`);

            const data = await response.json();

            // Obtenemos los datos crudos (0-10)
            // Tu backend devuelve algo como: { luxury: 8, safety: 5 ... }
            const rawParams = data.parameters || data;

            console.log("Valores originales del Backend (0-10):", rawParams);

            // --- TRANSFORMACIÓN DE DATOS (0-10 -> 0-100) ---
            const normalizedParams = {};

            // Iteramos por cada clave (luxury, safety...) y multiplicamos por 10
            Object.keys(rawParams).forEach(key => {
                const value = rawParams[key];
                if (typeof value === 'number') {
                    normalizedParams[key] = value * 10; // Escalar al 100%
                } else {
                    normalizedParams[key] = value;
                }
            });

            console.log("Valores normalizados para Frontend (0-100):", normalizedParams);

            return normalizedParams;

        } catch (error) {
            console.error("Error API Parametrize:", error);
            // Fallback en escala 0-100
            return { luxury: 50, safety: 50, nature: 50, nightlife: 50, mobility: 50 };
        }
    },

    // 2. Lógica Local de Recomendación
    getRecommendations: async (userParams) => {
        try {
            return new Promise((resolve) => {
                // userParams ya viene en escala 0-100 gracias a la función de arriba
                const scored = Object.values(MOCK_NEIGHBORHOODS).map(nb => {
                    let diff = 0;
                    Object.keys(userParams).forEach(key => {
                        // nb.stats también está en 0-100, así que la resta es correcta
                        diff += Math.abs(userParams[key] - (nb.stats[key] || 50));
                    });

                    // 500 es la diferencia máxima posible (5 params * 100 de diferencia)
                    // Calculamos el porcentaje de match
                    const matchScore = Math.max(0, 100 - (diff / 5));

                    return { ...nb, score: Math.round(matchScore) };
                });

                scored.sort((a, b) => b.score - a.score);
                resolve(scored);
            });
        } catch (error) {
            console.error("Error recomendando:", error);
            return [];
        }
    },

    // 3. Búsqueda Local de Polígonos
    getNeighborhoodPolygonLocal: (targetName) => {
        try {
            const feature = laNeighborhoodsData.features.find(
                f => f.properties.NAME === targetName
            );

            if (feature) {
                return {
                    geojson: feature.geometry,
                    display_name: feature.properties.NAME
                };
            }
            return null;
        } catch (error) {
            console.error("Error local geojson:", error);
            return null;
        }
    }
};