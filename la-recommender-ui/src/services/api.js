// Datos Mock con stats para calcular el match
export const MOCK_NEIGHBORHOODS = {
    'dtla': {
        id: 'dtla',
        name: 'Downtown LA',
        description: 'El corazón urbano. Rascacielos, cultura y movimiento constante.',
        // Definimos sus atributos para calcular el match real
        stats: { luxury: 60, safety: 40, nature: 10, nightlife: 90, mobility: 100 },
        coordinates: [
            [34.064, -118.255], [34.038, -118.270], [34.030, -118.250], [34.050, -118.230]
        ],
        center: [34.045, -118.250]
    },
    'beverly_hills': {
        id: 'beverly_hills',
        name: 'Beverly Hills',
        description: 'Lujo exclusivo, privacidad y poder.',
        stats: { luxury: 100, safety: 90, nature: 50, nightlife: 40, mobility: 60 },
        coordinates: [
            [34.095, -118.430], [34.090, -118.390], [34.065, -118.390], [34.065, -118.420]
        ],
        center: [34.075, -118.400]
    },
    'santa_monica': {
        id: 'santa_monica',
        name: 'Santa Monica',
        description: 'Brisa marina, tecnología y libertad.',
        stats: { luxury: 70, safety: 70, nature: 100, nightlife: 60, mobility: 50 },
        coordinates: [
            [34.030, -118.510], [34.035, -118.470], [34.005, -118.470], [34.000, -118.490]
        ],
        center: [34.015, -118.490]
    },
    'silver_lake': {
        id: 'silver_lake',
        name: 'Silver Lake',
        description: 'Bohemio, auténtico y comunitario.',
        stats: { luxury: 40, safety: 60, nature: 60, nightlife: 70, mobility: 40 },
        coordinates: [
            [34.100, -118.285], [34.095, -118.260], [34.080, -118.270], [34.085, -118.290]
        ],
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
            }, 1000);
        });
    },

    // AHORA DEVUELVE UN ARRAY ORDENADO POR COINCIDENCIA
    getRecommendations: async (userParams) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 1. Calcular "distancia" entre lo que quiere el usuario y cada barrio
                const scored = Object.values(MOCK_NEIGHBORHOODS).map(nb => {
                    let diff = 0;
                    // Comparamos cada estadística
                    Object.keys(userParams).forEach(key => {
                        diff += Math.abs(userParams[key] - (nb.stats[key] || 50));
                    });
                    // Cuanto menor la diferencia, mayor el score (Match %)
                    // 500 es la diferencia máxima posible aprox (5 params * 100)
                    const matchScore = Math.max(0, 100 - (diff / 5));

                    return { ...nb, score: Math.round(matchScore) };
                });

                // 2. Ordenar por mejor puntuación
                scored.sort((a, b) => b.score - a.score);

                // 3. Devolver el Top 3 (o todos)
                resolve(scored); // Devolvemos el array completo de objetos ya enriquecidos
            }, 1200);
        });
    }
};