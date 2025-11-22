import React, { useState } from 'react';
import { Send, MapPin, Sliders, MessageSquare, Info, ChevronRight, Loader2, Shield, Trees, DollarSign, Music, Car, Trophy } from 'lucide-react';
import { SimulatedAPI } from './services/api';
import Map3D from './components/Map3D'; // Asegúrate de importar el nuevo mapa
import SliderControl from './components/SliderControl';

export default function App() {
    const [isOpen, setIsOpen] = useState(true);
    const [viewState, setViewState] = useState('input'); // input | loading_params | tuning | loading_result | result
    const [chatText, setChatText] = useState('');
    const [parameters, setParameters] = useState(null);

    // NUEVO ESTADO PARA LISTAS
    const [results, setResults] = useState([]);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);

    const handleAnalyzeText = async () => {
        if (!chatText.trim()) return;
        setViewState('loading_params');
        try {
            const params = await SimulatedAPI.parseTextToParams(chatText);
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
            // Llamamos a la nueva función que devuelve ARRAY
            const data = await SimulatedAPI.getRecommendations(parameters);
            setResults(data);

            // Seleccionamos automáticamente el Top 1
            if (data.length > 0) setSelectedNeighborhood(data[0]);

            setViewState('result');
        } catch (error) {
            console.error(error);
            setViewState('tuning');
        }
    };

    const resetSearch = () => {
        setChatText('');
        setParameters(null);
        setResults([]);
        setSelectedNeighborhood(null);
        setViewState('input');
    };

    return (
        <div className="relative w-full h-screen bg-slate-950 overflow-hidden font-sans text-slate-200">

            {/* MAPA 3D */}
            <div className="absolute inset-0 z-0">
                <Map3D
                    neighborhoods={results}
                    focusedNeighborhood={selectedNeighborhood}
                />
            </div>

            {/* SIDEBAR */}
            <div className={`absolute top-4 left-4 bottom-4 w-96 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col transition-transform duration-500 z-10 ${isOpen ? 'translate-x-0' : '-translate-x-[110%]'}`}>

                {/* Header */}
                <div className="p-6 border-b border-slate-700/50 flex justify-between items-center shrink-0">
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                            <MapPin className="text-violet-500" />
                            L.A. Finder
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">Joc de Barris - HackEPS 2025</p>
                    </div>
                    {viewState !== 'input' && (
                        <button onClick={resetSearch} className="text-xs text-slate-500 hover:text-white underline">Reiniciar</button>
                    )}
                </div>

                {/* Contenido con Scroll */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">

                    {/* VISTA 1: INPUT */}
                    {viewState === 'input' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="bg-violet-500/10 border border-violet-500/20 p-4 rounded-xl">
                                <p className="text-sm text-violet-200">"Dime quién eres o qué buscas, y encontraré tu trono en Los Ángeles."</p>
                            </div>
                            <textarea
                                className="w-full h-32 bg-slate-800 border border-slate-600 rounded-xl p-3 text-sm focus:ring-2 focus:ring-violet-500 outline-none resize-none placeholder:text-slate-600"
                                placeholder="Ej: Soy una ejecutiva que busca lujo..."
                                value={chatText}
                                onChange={(e) => setChatText(e.target.value)}
                            />
                            <button onClick={handleAnalyzeText} disabled={!chatText} className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold flex justify-center gap-2">
                                <MessageSquare size={18} /> Analizar
                            </button>
                        </div>
                    )}

                    {/* VISTA 2 y 4: LOADERS (Sin cambios) */}
                    {(viewState === 'loading_params' || viewState === 'loading_result') && (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="animate-spin text-violet-500" size={40} />
                            <p className="text-sm text-slate-400">Procesando datos...</p>
                        </div>
                    )}

                    {/* VISTA 3: TUNING (Igual que antes) */}
                    {viewState === 'tuning' && parameters && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <h3 className="text-white font-semibold flex gap-2"><Sliders size={16}/> Ajuste de Parámetros</h3>
                            </div>
                            <div className="space-y-2">
                                <SliderControl label="Seguridad" icon={Shield} value={parameters.safety} onChange={(v) => setParameters({...parameters, safety: v})} />
                                <SliderControl label="Lujo" icon={DollarSign} value={parameters.luxury} onChange={(v) => setParameters({...parameters, luxury: v})} />
                                <SliderControl label="Naturaleza" icon={Trees} value={parameters.nature} onChange={(v) => setParameters({...parameters, nature: v})} />
                                <SliderControl label="Noche" icon={Music} value={parameters.nightlife} onChange={(v) => setParameters({...parameters, nightlife: v})} />
                                <SliderControl label="Movilidad" icon={Car} value={parameters.mobility} onChange={(v) => setParameters({...parameters, mobility: v})} />
                            </div>
                            <button onClick={handleGetRecommendation} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold mt-4 flex justify-center gap-2">
                                <Send size={18} /> Buscar Top Barrios
                            </button>
                        </div>
                    )}

                    {/* VISTA 5: LISTA DE RESULTADOS */}
                    {viewState === 'result' && results.length > 0 && (
                        <div className="space-y-4 animate-in zoom-in-95 duration-500">
                            <div className="flex items-center gap-2 mb-4">
                                <Trophy className="text-yellow-400" size={20} />
                                <h2 className="text-lg font-bold text-white">Tu Top Recomendado</h2>
                            </div>

                            {/* Renderizamos la lista de tarjetas */}
                            {results.map((item, index) => {
                                const isSelected = selectedNeighborhood?.id === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedNeighborhood(item)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                                            isSelected
                                                ? 'bg-violet-900/30 border-violet-500 shadow-lg shadow-violet-900/20 scale-[1.02]'
                                                : 'bg-slate-800 border-slate-700 hover:bg-slate-750 hover:border-slate-600'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index === 0 ? 'bg-yellow-500 text-black' : 'bg-slate-600 text-white'}`}>
                                                    {index + 1}
                                                </span>
                                                <h3 className="font-bold text-white">{item.name}</h3>
                                            </div>
                                            <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                                                {item.score}% Match
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                                            {item.description}
                                        </p>
                                        {isSelected && (
                                            <div className="text-[10px] text-violet-300 font-medium animate-in fade-in">
                                                Clic para ver detalles en mapa
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            <button onClick={() => setViewState('tuning')} className="w-full py-3 mt-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm">
                                Ajustar filtros de nuevo
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* Toggle Button */}
            <button onClick={() => setIsOpen(!isOpen)} className={`absolute top-4 transition-all duration-500 z-20 bg-slate-800 p-2 rounded-r-lg border-y border-r border-slate-600 text-slate-400 hover:text-white ${isOpen ? 'left-96' : 'left-0'}`}>
                <ChevronRight size={20} className={`transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>

        </div>
    );
}