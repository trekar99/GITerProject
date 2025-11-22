// 1. Importamos el archivo GeoJSON (convertido a .json)
import laNeighborhoodsData from '../data/Neighborhood_Councils_(Certified).json';

// 2. Datos Mock mapeados a barrios REALES del archivo GeoJSON
export const MOCK_NEIGHBORHOODS = {
    'echo_park': { // <--- NUEVO (Reemplaza a Downtown)
        id: 'echo_park',
        name: 'Echo Park',
        // Nombre exacto en el GeoJSON:
        geojsonName: 'ECHO PARK NC',
        description: 'Vida urbana relajada, el famoso lago con patos, cafés de especialidad y vistas al skyline.',
        // Stats: Mucha naturaleza (por el parque), buen ambiente nocturno, no muy lujoso
        stats: { luxury: 40, safety: 60, nature: 80, nightlife: 70, mobility: 60 },
        center: [34.078, -118.260] // Coordenadas de Echo Park
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
        description: 'Espíritu libre, canales, playa y una comunidad artística vibrante.',
        stats: { luxury: 70, safety: 60, nature: 90, nightlife: 80, mobility: 70 },
        center: [33.990, -118.465]
    },
    'silver_lake': {
        id: 'silver_lake',
        name: 'Silver Lake',
        geojsonName: 'SILVER LAKE NC',
        description: 'Bohemio, auténtico y comunitario. El barrio hipster original.',
        stats: { luxury: 50, safety: 60, nature: 50, nightlife: 70, mobility: 50 },
        center: [34.090, -118.275]
    }
};

export const SimulatedAPI = {
    // 1. Simulación de NLP (Texto -> Parámetros)
    parseTextToParams: async (text) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const params = { luxury: 50, safety: 50, nature: 50, nightlife: 50, mobility: 50 };
                const t = text.toLowerCase();

                // Palabras clave actualizadas
                if (t.includes('lujo') || t.includes('dinero') || t.includes('cersei') || t.includes('mansión')) {
                    params.luxury = 90; params.safety = 90;
                }
                // Ajustamos para pillar Echo Park/Silver Lake
                if (t.includes('fiesta') || t.includes('noche') || t.includes('tyrion') || t.includes('bar')) {
                    params.nightlife = 90; params.mobility = 70;
                }
                // Naturaleza ahora incluye "lago" y "parque" para Echo Park
                if (t.includes('mar') || t.includes('playa') || t.includes('daenerys') || t.includes('lago') || t.includes('parque')) {
                    params.nature = 90; params.luxury = 60;
                }
                if (t.includes('tranquilo') || t.includes('hipster') || t.includes('jon') || t.includes('local') || t.includes('café')) {
                    params.luxury = 30; params.nature = 70; params.nightlife = 60;
                }

                resolve(params);
            }, 800);
        });
    },

    // 2. Recomendador (Algoritmo de coincidencia)
    getRecommendations: async (userParams) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const scored = Object.values(MOCK_NEIGHBORHOODS).map(nb => {
                    let diff = 0;
                    Object.keys(userParams).forEach(key => {
                        diff += Math.abs(userParams[key] - (nb.stats[key] || 50));
                    });
                    // Algoritmo simple de similitud (0 a 100%)
                    const matchScore = Math.max(0, 100 - (diff / 5));
                    return { ...nb, score: Math.round(matchScore) };
                });

                // Ordenar de mayor match a menor
                scored.sort((a, b) => b.score - a.score);

                resolve(scored);
            }, 1000);
        });
    },

    // 3. BÚSQUEDA LOCAL EN TU ARCHIVO (Síncrono e Instantáneo)
    getNeighborhoodPolygonLocal: (targetName) => {
        try {
            console.log(`🔍 Buscando polígono local para: "${targetName}"...`);

            // Buscamos dentro de las "features" del GeoJSON importado
            const feature = laNeighborhoodsData.features.find(
                f => f.properties.NAME === targetName // Coincidencia exacta
            );

            if (feature) {
                console.log(`✅ ¡Encontrado!`);
                return {
                    geojson: feature.geometry, // Devolvemos la geometría tal cual
                    display_name: feature.properties.NAME
                };
            } else {
                console.warn(`⚠️ NO se encontró "${targetName}" en el archivo local.`);
                return null;
            }
        } catch (error) {
            console.error("Error crítico buscando en GeoJSON local:", error);
            return null;
        }
    }
};