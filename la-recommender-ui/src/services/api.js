// Datos Mock Ligeros (Sin coordenadas pesadas al principio)
export const MOCK_NEIGHBORHOODS = {
    'dtla': {
        id: 'dtla',
        name: 'Downtown Los Angeles', // Nombre real para buscar en OSM
        description: 'El corazón urbano. Rascacielos, cultura y movimiento constante.',
        stats: { luxury: 60, safety: 40, nature: 10, nightlife: 90, mobility: 100 },
        // Coordenada central aproximada para volar allí antes de cargar el polígono
        center: [34.045, -118.250]
    },
    'beverly_hills': {
        id: 'beverly_hills',
        name: 'Beverly Hills',
        description: 'Lujo exclusivo, privacidad y poder.',
        stats: { luxury: 100, safety: 90, nature: 50, nightlife: 40, mobility: 60 },
        center: [34.075, -118.400]
    },
    'santa_monica': {
        id: 'santa_monica',
        name: 'Santa Monica',
        description: 'Brisa marina, tecnología y libertad.',
        stats: { luxury: 70, safety: 70, nature: 100, nightlife: 60, mobility: 50 },
        center: [34.015, -118.490]
    },
    'silver_lake': {
        id: 'silver_lake',
        name: 'Silver Lake',
        description: 'Bohemio, auténtico y comunitario.',
        stats: { luxury: 40, safety: 60, nature: 60, nightlife: 70, mobility: 40 },
        center: [34.090, -118.275]
    }
};

export const SimulatedAPI = {
    parseTextToParams: async (text) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const params = { luxury: 50, safety: 50, nature: 50, nightlife: 50, mobility: 50 };
                const t = text.toLowerCase();
                if (t.includes('lujo') || t.includes('dinero') || t.includes('cersei')) { params.luxury = 90; params.safety = 90; }
                if (t.includes('fiesta') || t.includes('noche') || t.includes('tyrion')) { params.nightlife = 90; params.mobility = 80; }
                if (t.includes('mar') || t.includes('aire') || t.includes('daenerys')) { params.nature = 90; params.luxury = 70; }
                if (t.includes('tranquilo') || t.includes('barato') || t.includes('jon')) { params.luxury = 30; params.nature = 80; }
                resolve(params);
            }, 800);
        });
    },

    getRecommendations: async (userParams) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const scored = Object.values(MOCK_NEIGHBORHOODS).map(nb => {
                    let diff = 0;
                    Object.keys(userParams).forEach(key => {
                        diff += Math.abs(userParams[key] - (nb.stats[key] || 50));
                    });
                    const matchScore = Math.max(0, 100 - (diff / 5));
                    return { ...nb, score: Math.round(matchScore) };
                });
                scored.sort((a, b) => b.score - a.score);
                resolve(scored);
            }, 1000);
        });
    },

    // --- NUEVA FUNCIÓN: API REAL DE OPENSTREETMAP ---
    fetchNeighborhoodPolygon: async (neighborhoodName) => {
        try {
            // Buscamos en Los Angeles, California explícitamente
            const query = `${neighborhoodName}, Los Angeles, California`;
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&polygon_geojson=1&limit=1`;

            const response = await fetch(url);
            const data = await response.json();

            if (data && data.length > 0) {
                // Devolvemos el GeoJSON del polígono y el Bounding Box
                return {
                    geojson: data[0].geojson,
                    display_name: data[0].display_name
                };
            }
            return null;
        } catch (error) {
            console.error("Error fetching polygon:", error);
            return null;
        }
    }
};