import React, { useState } from 'react';
import { Send, MapPin, Sliders, MessageSquare, Info, ChevronRight, Loader2, Shield, Trees, DollarSign, Music, Car, Trophy, Crown, Scroll, X, User, Feather } from 'lucide-react';
import { APIService } from './services/api';
import Map3D from './components/Map3D';
import SliderControl from './components/SliderControl';
import JustificationModal from './components/JustificationModal';

const PERSONAS = [
    {
        name: "Samwell Tarly",
        role: "El Académico Familiar",
        desc: "Un amable investigador académico y padre temprano. Samwell traslada a su joven familia a Los Ángeles con un salario universitario modesto. Su búsqueda se centra únicamente en encontrar un barrio tranquilo, seguro y asequible en el que su hijo pueda crecer, con buenos parques y una biblioteca cerca."
    },
    {
        name: "Daenerys",
        role: "Emprendedora Ética",
        desc: "Fundadora de una startup sostenible, es nueva en la ciudad con sus tres \"dragones\" (así le gusta referirse a sus perros). Busca un barrio con alma, lleno de negocios locales y con un fuerte sentido de comunidad."
    },
    {
        name: "Cersei",
        role: "Reina Corporativa",
        desc: "Una ejecutiva de alto nivel que vive por el poder, el prestigio y la privacidad. Para ella y sus hijos, quiere vivir aislada en una burbuja de máxima seguridad, escuelas de élite y tiendas de lujo."
    },
    {
        name: "Bran",
        role: "Analista Total",
        desc: "Un científico de datos que trabaja 100% desde casa. Se mueve en silla de ruedas, así que necesita cero barreras arquitectónicas. Busca un lugar tranquilo, silencioso y con la mejor fibra óptica para poder trabajar sin límites."
    },
    {
        name: "Jon",
        role: "Guardián de la Comunidad",
        desc: "Trabaja en los servicios de emergencia y tiene un sueldo público. Busca un barrio auténtico, donde los vecinos se conozcan. Valora lo práctico, no el lujo, y necesita tener la naturaleza cerca para desconectar."
    },
    {
        name: "Arya",
        role: "Nómada Urbana",
        desc: "Una freelance independiente que valora el anonimato y la libertad por encima de todo. Necesita una \"base\" en una zona densa y movida, donde pueda mezclarse con la gente. Transporte público 24/7 para cualquier aventura."
    },
    {
        name: "Tyrion",
        role: "Estratega Urbano",
        desc: "Un consultor brillante y muy social. Su hábitat es el epicentro cultural y gastronómico de la ciudad. Lo quiere todo a pie: de la reunión al mejor restaurante, y de allí a un bar sin coger ningún taxi."
    }
];

export default function App() {
    const [isOpen, setIsOpen] = useState(true);
    const [viewState, setViewState] = useState('input');
    const [chatText, setChatText] = useState('');
    const [parameters, setParameters] = useState(null);

    const [results, setResults] = useState([]);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);

    const [justificationText, setJustificationText] = useState('');
    const [loadingJustification, setLoadingJustification] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isGoTMode, setIsGoTMode] = useState(false);

    const handleAnalyzeText = async () => {
        if (!chatText.trim()) return;
        setViewState('loading_params');
        try {
            const params = await APIService.parseTextToParams(chatText);
            setParameters(params);
            setViewState('tuning');
        } catch (error) {
            console.error(error);
            setViewState('input');
        }
    };

    const handleGetRecommendation = async () => {
        setViewState('loading_result');
        try {
            const data = await APIService.getRecommendations(parameters);
            setResults(data);
            setViewState('result');
        } catch (error) {
            console.error(error);
            setViewState('tuning');
        }
    };

    const handleSelectNeighborhood = async (neighborhood) => {
        setViewState('result');
        if (!isOpen) setIsOpen(true);

        let targetNeighborhood = neighborhood;

        if (!targetNeighborhood.polygonGeoJSON) {
            const polygonData = APIService.getNeighborhoodPolygonLocal(neighborhood.geojsonName);
            if (polygonData) {
                targetNeighborhood = {
                    ...neighborhood,
                    polygonGeoJSON: polygonData.geojson,
                    center: polygonData.calculatedCenter || neighborhood.center
                };
                setResults(prev => prev.map(item => item.id === neighborhood.id ? targetNeighborhood : item));
            }
        }
        setSelectedNeighborhood(targetNeighborhood);

        setJustificationText('');
        setLoadingJustification(true);
        setIsModalOpen(true);

        const text = await APIService.getJustification(targetNeighborhood, isGoTMode);
        setJustificationText(text);
        setLoadingJustification(false);
    };

    const resetSearch = () => {
        setChatText('');
        setParameters(null);
        setResults([]);
        setSelectedNeighborhood(null);
        setJustificationText('');
        setIsModalOpen(false);
        setViewState('input');
    };

    const theme = isGoTMode ? {
        bg: 'bg-[#0f0a05]',
        sidebarBg: 'bg-[#1c1610]/95 border-[#d4af37]/20',
        textPrimary: 'text-[#d4af37] font-got',
        textSecondary: 'text-[#a8a29e] font-serif',
        accent: 'bg-[#7f1d1d] hover:bg-[#991b1b] text-[#d4af37] font-got border border-[#d4af37]/50',
        card: 'bg-[#26201a] border-[#d4af37]/20 hover:border-[#d4af37]/60',
        cardSelected: 'bg-[#381e1e] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.2)]',
        mapStyle: 'mapbox://styles/mapbox/dark-v11'
    } : {
        bg: 'bg-slate-950',
        sidebarBg: 'bg-slate-900/90 border-slate-700/50 backdrop-blur-xl',
        textPrimary: 'text-white font-sans',
        textSecondary: 'text-slate-400 font-sans',
        accent: 'bg-violet-600 hover:bg-violet-500 text-white font-semibold',
        card: 'bg-slate-800 border-slate-700 hover:bg-slate-750',
        cardSelected: 'bg-violet-900/30 border-violet-500 shadow-lg shadow-violet-900/20',
        mapStyle: 'mapbox://styles/mapbox/dark-v11'
    };

    return (
        <div className={`relative w-full h-screen overflow-hidden ${theme.bg} transition-colors duration-700`}>

            <JustificationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                text={justificationText}
                neighborhoodName={selectedNeighborhood?.name}
                isGoTMode={isGoTMode}
                isLoading={loadingJustification}
            />

            <div className={`absolute inset-0 z-0 transition-all duration-1000 ${isGoTMode ? 'sepia-[0.4] brightness-[1.2] contrast-125 hue-rotate-[5deg]' : ''}`}>
                <Map3D
                    neighborhoods={results}
                    focusedNeighborhood={selectedNeighborhood}
                    mapStyle={theme.mapStyle}
                    isGoTMode={isGoTMode}
                    onSelectNeighborhood={handleSelectNeighborhood}
                />
            </div>

            <div className={`absolute top-4 left-4 bottom-4 w-96 rounded-2xl shadow-2xl flex flex-col transition-all duration-500 z-10 ${theme.sidebarBg} ${isOpen ? 'translate-x-0' : '-translate-x-[110%]'}`}>

                <div className="p-6 border-b border-white/5 flex justify-between items-start shrink-0">
                    <div>
                        <h1 className={`text-2xl tracking-tight flex items-center gap-2 ${theme.textPrimary}`}>
                            {isGoTMode ? <Crown className="text-[#d4af37]" /> : <MapPin className="text-violet-500" />}
                            {isGoTMode ? "Westeros Finder" : "L.A. Finder"}
                        </h1>
                        <p className={`text-xs mt-1 ${theme.textSecondary}`}>
                            {isGoTMode ? "El Trono de Hierro te espera" : "Joc de Barris - HackEPS 2025"}
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsGoTMode(!isGoTMode)}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                                title="Cambiar Modo"
                            >
                                {isGoTMode ? <Scroll size={20} className="text-[#d4af37] animate-pulse" /> : <Crown size={20} />}
                            </button>

                            <button
                                onClick={() => setIsOpen(false)}
                                className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isGoTMode ? 'text-[#d4af37]' : 'text-slate-400 hover:text-white'}`}
                                title="Cerrar menú"
                            >
                                <ChevronRight size={20} className="rotate-180" />
                            </button>
                        </div>

                        {viewState !== 'input' && (
                            <button onClick={resetSearch} className={`text-xs hover:text-white underline ${theme.textSecondary}`}>
                                {isGoTMode ? "Empezar de nuevo" : "Reiniciar"}
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">

                    {viewState === 'input' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className={`p-4 rounded-xl border ${isGoTMode ? 'bg-[#3e3327]/40 border-[#d4af37]/30' : 'bg-violet-500/10 border-violet-500/20'}`}>
                                <p className={`text-sm ${isGoTMode ? 'text-[#d4af37] italic font-serif' : 'text-violet-200'}`}>
                                    {isGoTMode
                                        ? '"Cuando juegas al juego de barrios, o ganas o vives en el tráfico. No hay término medio."'
                                        : '"Dime quién eres o qué buscas, y encontraré tu trono en Los Ángeles."'}
                                </p>
                            </div>
                            <textarea
                                className={`w-full h-32 rounded-xl p-3 text-sm outline-none resize-none transition-all ${isGoTMode ? 'bg-[#0f0a05] border-[#d4af37]/30 text-[#cdcfd1] font-serif placeholder-[#6b5f53] focus:border-[#d4af37]' : 'bg-slate-800 border-slate-600 text-white focus:ring-2 focus:ring-violet-500'}`}
                                placeholder={isGoTMode ? "Ej: Soy Madre de Dragones, busco poder y calor..." : "Ej: Soy una ejecutiva que busca lujo..."}
                                value={chatText}
                                onChange={(e) => setChatText(e.target.value)}
                            />

                            <div className="space-y-3 pt-2">
                                <p className={`text-xs uppercase tracking-wider font-bold ${theme.textSecondary}`}>
                                    {isGoTMode ? "Elegir un Pretendiente" : "Perfiles Rápidos"}
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {PERSONAS.map((p, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setChatText(p.desc)}
                                            className={`text-left p-2 rounded-lg border transition-all text-xs group relative overflow-hidden ${
                                                isGoTMode
                                                    ? 'bg-[#2c241b] border-[#d4af37]/20 hover:border-[#d4af37] text-[#cdcfd1] hover:text-[#d4af37]'
                                                    : 'bg-slate-800 border-slate-700 hover:border-violet-500 text-slate-300 hover:text-white'
                                            }`}
                                        >
                                            <div className={`font-bold mb-0.5 ${isGoTMode ? 'font-got' : ''}`}>{p.name}</div>
                                            <div className="opacity-70 text-[10px] truncate">{p.role}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button onClick={handleAnalyzeText} disabled={!chatText} className={`w-full py-3 rounded-xl flex justify-center gap-2 transition-all shadow-lg ${theme.accent}`}>
                                {isGoTMode ? <Scroll size={18} /> : <MessageSquare size={18} />}
                                {isGoTMode ? "Consultar al Maestre" : "Analizar"}
                            </button>
                        </div>
                    )}

                    {(viewState === 'loading_params' || viewState === 'loading_result') && (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <Loader2 className={`animate-spin ${isGoTMode ? 'text-[#d4af37]' : 'text-violet-500'}`} size={40} />
                            <p className={`text-sm ${theme.textSecondary}`}>
                                {isGoTMode ? "Los cuervos están volando..." : "Procesando datos..."}
                            </p>
                        </div>
                    )}

                    {viewState === 'tuning' && parameters && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className={`p-4 rounded-xl border ${isGoTMode ? 'bg-[#3e3327]/20 border-[#d4af37]/20' : 'bg-slate-800/50 border-slate-700'}`}>
                                <h3 className={`font-semibold flex gap-2 items-center ${theme.textPrimary}`}>
                                    <Sliders size={16} className={isGoTMode ? 'text-[#d4af37]' : ''}/>
                                    {isGoTMode ? "Ajustes del Consejo" : "Ajuste de Parámetros"}
                                </h3>
                            </div>
                            <div className="space-y-2">
                                <SliderControl label={isGoTMode ? "Defensas y Muros" : "Seguridad"} icon={Shield} value={parameters.security_tranquility} onChange={(v) => setParameters({...parameters, security_tranquility: v})} isGoT={isGoTMode} />
                                <SliderControl label={isGoTMode ? "Oro y Riquezas" : "Lujo"} icon={DollarSign} value={parameters.luxury_exclusivity} onChange={(v) => setParameters({...parameters, luxury_exclusivity: v})} isGoT={isGoTMode} />
                                <SliderControl label={isGoTMode ? "Bosques de Dioses" : "Naturaleza"} icon={Trees} value={parameters.nature_outdoors} onChange={(v) => setParameters({...parameters, nature_outdoors: v})} isGoT={isGoTMode} />
                                <SliderControl label={isGoTMode ? "Festines y Vino" : "Vida Nocturna"} icon={Music} value={parameters.nightlife_social} onChange={(v) => setParameters({...parameters, nightlife_social: v})} isGoT={isGoTMode} />
                                <SliderControl label={isGoTMode ? "Caminos Reales" : "Movilidad"} icon={Car} value={parameters.connectivity_services} onChange={(v) => setParameters({...parameters, connectivity_services: v})} isGoT={isGoTMode} />
                            </div>
                            <button onClick={handleGetRecommendation} className={`w-full py-3 rounded-xl font-semibold mt-4 flex justify-center gap-2 shadow-lg transition-all ${isGoTMode ? 'bg-[#1f4e1f] hover:bg-[#2b6b2b] text-[#d4af37] border border-[#d4af37] font-got' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}>
                                <Send size={18} />
                                {isGoTMode ? "Reclamar mis tierras" : "Buscar Top Barrios"}
                            </button>
                        </div>
                    )}

                    {viewState === 'result' && results.length > 0 && (
                        <div className="space-y-4 animate-in zoom-in-95 duration-500">
                            <div className="flex items-center gap-2 mb-4">
                                <Trophy className={isGoTMode ? "text-[#d4af37]" : "text-yellow-400"} size={20} />
                                <h2 className={`text-lg font-bold ${theme.textPrimary}`}>
                                    {isGoTMode ? "Tus Reinos Ideales" : "Tu Top Recomendado"}
                                </h2>
                            </div>

                            {results.map((item, index) => {
                                const isSelected = selectedNeighborhood?.id === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => handleSelectNeighborhood(item)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                                            isSelected
                                                ? theme.cardSelected
                                                : theme.card
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                                    isGoTMode
                                                        ? (index === 0 ? 'bg-[#d4af37] text-[#8a1c1c]' : 'bg-[#3e3327] text-[#cdcfd1] border border-[#d4af37]/30')
                                                        : (index === 0 ? 'bg-yellow-500 text-black' : 'bg-slate-600 text-white')
                                                }`}>
                                                    {index + 1}
                                                </span>
                                                <h3 className={`font-bold ${theme.textPrimary}`}>{item.name}</h3>
                                            </div>

                                            <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                                                isGoTMode
                                                    ? 'bg-[#2f3325] text-[#a3b18a] border border-[#5c664a]'
                                                    : 'bg-emerald-400/10 text-emerald-400'
                                            }`}>
                                                {item.score > 100 ? 100 : item.score}% Match
                                            </span>
                                        </div>
                                        <p className={`text-xs line-clamp-2 mb-2 ${theme.textSecondary}`}>
                                            {item.description}
                                        </p>
                                        {isSelected && (
                                            <div className={`text-[10px] font-medium animate-in fade-in flex items-center gap-1 mt-2 ${isGoTMode ? 'text-[#d4af37]' : 'text-violet-300'}`}>
                                                <Info size={10} />
                                                {loadingJustification ? "Analizando..." : (isGoTMode ? "Ver veredicto del maestre" : "Ver análisis IA")}
                                            </div>
                                        )}
                                        {isSelected && !item.polygonGeoJSON && (
                                            <div className="text-[10px] text-orange-400 mt-2 font-mono">
                                                ⚠️ {isGoTMode ? "Mapas antiguos perdidos" : "Polígono no encontrado"}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            <button onClick={() => setViewState('tuning')} className={`w-full py-3 mt-4 rounded-lg text-sm transition-all ${isGoTMode ? 'bg-[#26201a] hover:bg-[#382e25] text-[#d4af37] border border-[#d4af37]/30 font-got' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}`}>
                                {isGoTMode ? "Convocar nuevo consejo" : "Ajustar filtros de nuevo"}
                            </button>
                        </div>
                    )}

                </div>
            </div>

            <button
                onClick={() => setIsOpen(true)}
                className={`absolute top-6 left-0 z-20 p-3 rounded-r-xl border-y border-r shadow-lg transition-all duration-300
                    ${isOpen ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'} 
                    ${isGoTMode ? 'bg-[#2c241b] border-[#d4af37]/30 text-[#d4af37]' : 'bg-slate-900 border-slate-700 text-white hover:text-violet-400'}
                `}
                title="Abrir menú"
            >
                <ChevronRight size={24} />
            </button>

        </div>
    );
}