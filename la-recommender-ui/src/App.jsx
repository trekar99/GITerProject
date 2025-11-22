import React, { useState } from 'react';
import { Send, MapPin, Sliders, MessageSquare, Info, ChevronRight, Loader2, Shield, Trees, DollarSign, Music, Car } from 'lucide-react';
import { SimulatedAPI } from './services/api';
import MapSVG from './components/MapSVG';
import SliderControl from './components/SliderControl';

export default function App() {
    const [isOpen, setIsOpen] = useState(true);
    const [viewState, setViewState] = useState('input');
    const [chatText, setChatText] = useState('');
    const [parameters, setParameters] = useState(null);
    const [result, setResult] = useState(null);

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
            const id = await SimulatedAPI.getRecommendationID(parameters);
            const data = await SimulatedAPI.getNeighborhoodData(id);
            setResult(data);
            setViewState('result');
        } catch (error) {
            console.error(error);
            setViewState('tuning');
        }
    };

    const resetSearch = () => {
        setChatText('');
        setParameters(null);
        setResult(null);
        setViewState('input');
    };

    return (
        <div className="relative w-full h-screen bg-slate-950 overflow-hidden font-sans text-slate-200">

            {/* MAPA */}
            <div className="absolute inset-0 z-0">
                <MapSVG activeNeighborhood={result} />
            </div>

            {/* SIDEBAR */}
            <div className={`absolute top-4 left-4 bottom-4 w-96 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col transition-transform duration-500 z-10 ${isOpen ? 'translate-x-0' : '-translate-x-[110%]'}`}>

                {/* Header */}
                <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
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

                {/* Contenido Dinámico */}
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

                    {/* VISTA 2: LOADING PARAMS */}
                    {viewState === 'loading_params' && (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="animate-spin text-violet-500" size={40} />
                            <p className="text-sm text-slate-400">Analizando...</p>
                        </div>
                    )}

                    {/* VISTA 3: TUNING */}
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
                                <Send size={18} /> Encontrar mi Barrio
                            </button>
                        </div>
                    )}

                    {/* VISTA 4: LOADING RESULT */}
                    {viewState === 'loading_result' && (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="animate-spin text-emerald-500" size={40} />
                            <p className="text-sm text-slate-400">Consultando el mapa...</p>
                        </div>
                    )}

                    {/* VISTA 5: RESULTADO */}
                    {viewState === 'result' && result && (
                        <div className="space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-1 rounded-2xl shadow-xl">
                                <div className="bg-slate-900 rounded-xl p-5">
                                    <span className="inline-block px-2 py-1 bg-violet-500/20 text-violet-300 text-[10px] font-bold uppercase rounded mb-3">Recomendación Top</span>
                                    <h2 className="text-2xl font-bold text-white mb-2">{result.name}</h2>
                                    <p className="text-sm text-slate-300 mb-4">{result.description}</p>
                                    <div className="border-t border-slate-700 pt-4">
                                        <p className="text-xs text-slate-500 uppercase font-bold">Match</p>
                                        <p className="text-violet-200 text-sm font-medium">{result.match}</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setViewState('tuning')} className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm">Ajustar filtros de nuevo</button>
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