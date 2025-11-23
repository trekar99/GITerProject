import laNeighborhoodsData from '../data/Neighborhood_Councils_(Certified).json';

const API_URL = 'http://localhost:8000/api';

export const APIService = {

    // 1. TEXTO -> PARÁMETROS
    parseTextToParams: async (text) => {
        try {
            const response = await fetch(`${API_URL}/parametrize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text })
            });

            if (!response.ok) throw new Error(`Error Backend: ${response.statusText}`);

            const data = await response.json();
            const rawParams = data.metrics || data.parameters || data;

            const normalizedParams = {};

            const keys = [
                'luxury_exclusivity',
                'security_tranquility',
                'nature_outdoors',
                'nightlife_social',
                'connectivity_services'
            ];

            keys.forEach(key => {
                const val = rawParams[key];
                normalizedParams[key] = (typeof val === 'number') ? val * 10 : 50;
            });

            return normalizedParams;

        } catch (error) {
            console.error("Error Parametrize:", error);
            return {
                luxury_exclusivity: 50,
                security_tranquility: 50,
                nature_outdoors: 50,
                nightlife_social: 50,
                connectivity_services: 50
            };
        }
    },

    // 2. RECOMENDACIÓN
    getRecommendations: async (userParams) => {
        try {
            const safeParams = {
                luxury_exclusivity: userParams.luxury_exclusivity || 0,
                security_tranquility: userParams.security_tranquility || 0,
                nature_outdoors: userParams.nature_outdoors || 0,
                nightlife_social: userParams.nightlife_social || 0,
                connectivity_services: userParams.connectivity_services || 0
            };

            const metricsPayload = {
                luxury_exclusivity: Math.round(safeParams.luxury_exclusivity / 10),
                security_tranquility: Math.round(safeParams.security_tranquility / 10),
                nature_outdoors: Math.round(safeParams.nature_outdoors / 10),
                nightlife_social: Math.round(safeParams.nightlife_social / 10),
                connectivity_services: Math.round(safeParams.connectivity_services / 10)
            };

            console.log("🚀 Enviando métricas (Enteros) al backend:", metricsPayload);

            const response = await fetch(`${API_URL}/recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(metricsPayload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("🔥 Error Backend Detallado:", errorText);
                throw new Error(`Error Recomendador (${response.status})`);
            }

            const data = await response.json();

            return data.map((item, index) => ({
                id: `result_${index}`,
                name: item.barrio,
                geojsonName: item.barrio.toUpperCase(),
                score: Math.round(item.score * 10),
                description: `Destaca por: ${item.justificaciones ? item.justificaciones.slice(0, 3).map(j => j.feature).join(', ') : 'N/A'}`,
                center: [34.0522, -118.2437]
            }));

        } catch (error) {
            console.error("Error recomendando:", error);
            return [];
        }
    },

    // 3. BÚSQUEDA LOCAL POLÍGONOS
    getNeighborhoodPolygonLocal: (targetName) => {
        try {
            if (!targetName) return null;

            const cleanTarget = targetName.toUpperCase().replace(' NC', '').trim();

            const feature = laNeighborhoodsData.features.find(f => {
                const fName = f.properties.NAME.toUpperCase();
                return fName === targetName.toUpperCase() || fName.includes(cleanTarget);
            });

            if (feature && feature.geometry) {
                let center = [34.0522, -118.2437];

                try {
                    const centroid = turf.centerOfMass(feature);
                    const [lng, lat] = centroid.geometry.coordinates;
                    center = [lat, lng];
                } catch (e) {
                    console.warn("Error calculando centroide con Turf, usando fallback simple", e);
                    // Fallback simple
                    const coords = feature.geometry.type === 'MultiPolygon'
                        ? feature.geometry.coordinates[0][0]
                        : feature.geometry.coordinates[0];
                    if (coords && coords.length > 0) center = [coords[0][1], coords[0][0]];
                }

                return {
                    geojson: feature.geometry,
                    display_name: feature.properties.NAME,
                    calculatedCenter: center
                };
            }
            return null;
        } catch (error) {
            console.error("Error local geojson:", error);
            return null;
        }
    },

    getJustification: async (neighborhoodData, isGoTMode) => {
        try {
            const payload = {
                text: {
                    barrio: neighborhoodData.name,
                    score: neighborhoodData.score,
                    razones: neighborhoodData.rawJustifications
                },
                got_mode: isGoTMode
            };

            const response = await fetch(`${API_URL}/llm/justify-results`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Error al justificar");

            const data = await response.json();
            return data.justification;

        } catch (error) {
            console.error("Error obteniendo justificación:", error);
            return "Los maestres están en silencio hoy. (Error de conexión)";
        }
    }
};