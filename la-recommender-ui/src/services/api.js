export const MOCK_NEIGHBORHOODS = {
    'dtla': {
        id: 'dtla',
        name: 'Downtown LA',
        description: 'El corazón urbano. Rascacielos, cultura y movimiento constante. Ideal para estrategas urbanos.',
        match: 'Tyrion Lannister',
        polygon: "M 450 250 L 550 220 L 580 300 L 480 350 Z",
        center: { x: 500, y: 280 }
    },
    'beverly_hills': {
        id: 'beverly_hills',
        name: 'Beverly Hills',
        description: 'Lujo exclusivo, privacidad y poder. El lugar perfecto para reinar con tranquilidad.',
        match: 'Cersei Lannister',
        polygon: "M 300 200 L 400 180 L 420 240 L 320 260 Z",
        center: { x: 360, y: 220 }
    },
    'santa_monica': {
        id: 'santa_monica',
        name: 'Santa Monica',
        description: 'Brisa marina, tecnología y libertad. Perfecto para nómadas y amantes de la naturaleza.',
        match: 'Daenerys Targaryen',
        polygon: "M 150 250 L 250 240 L 260 320 L 160 340 Z",
        center: { x: 210, y: 290 }
    },
    'silver_lake': {
        id: 'silver_lake',
        name: 'Silver Lake',
        description: 'Bohemio, auténtico y comunitario. Para quienes valoran la lealtad y lo local.',
        match: 'Jon Snow',
        polygon: "M 500 150 L 580 140 L 600 200 L 520 210 Z",
        center: { x: 550, y: 175 }
    }
};

export const SimulatedAPI = {
    parseTextToParams: async (text) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const params = { luxury: 50, safety: 50, nature: 50, nightlife: 50, mobility: 50 };
                const t = text.toLowerCase();
                // Lógica simple para demo
                if (t.includes('lujo') || t.includes('dinero') || t.includes('cersei')) { params.luxury = 90; params.safety = 90; }
                if (t.includes('fiesta') || t.includes('noche') || t.includes('tyrion')) { params.nightlife = 90; params.mobility = 80; }
                if (t.includes('mar') || t.includes('aire') || t.includes('daenerys')) { params.nature = 90; params.luxury = 70; }
                if (t.includes('tranquilo') || t.includes('barato') || t.includes('jon')) { params.luxury = 30; params.nature = 80; }
                resolve(params);
            }, 1500);
        });
    },

    getRecommendationID: async (params) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (params.luxury > 80) resolve('beverly_hills');
                else if (params.nightlife > 70) resolve('dtla');
                else if (params.nature > 70) resolve('santa_monica');
                else resolve('silver_lake');
            }, 1000);
        });
    },

    getNeighborhoodData: async (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const data = MOCK_NEIGHBORHOODS[id];
                if (data) resolve(data);
                else reject('Barrio no encontrado');
            }, 800);
        });
    }
};