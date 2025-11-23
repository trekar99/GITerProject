import React from 'react';
import { X, Feather, Bot } from 'lucide-react';

const JustificationModal = ({ isOpen, onClose, text, neighborhoodName, isGoTMode, isLoading }) => {

    const theme = isGoTMode ? {
        container: 'bg-[#1c1610]/95 border border-[#d4af37]/30 shadow-[0_0_30px_rgba(0,0,0,0.8)]',
        header: 'border-b border-[#d4af37]/20',
        title: 'text-[#d4af37] font-got text-lg tracking-widest',
        body: 'text-[#cdcfd1] font-serif text-sm leading-relaxed italic',
        icon: <Feather className="text-[#d4af37]" size={20} />,
        closeBtn: 'text-[#d4af37] hover:bg-[#d4af37]/10',
        loaderColor: 'text-[#d4af37]',
        scroll: 'scrollbar-thin scrollbar-thumb-[#d4af37]/20 scrollbar-track-transparent'
    } : {
        container: 'bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl',
        header: 'border-b border-slate-700/50',
        title: 'text-white font-bold text-lg tracking-tight',
        body: 'text-slate-300 font-sans text-sm leading-relaxed',
        icon: <Bot className="text-violet-500" size={20} />,
        closeBtn: 'text-slate-400 hover:text-white hover:bg-white/10',
        loaderColor: 'text-violet-500',
        scroll: 'scrollbar-hide'
    };

    return (
        <div
            className={`absolute top-4 right-4 bottom-4 w-80 rounded-2xl flex flex-col z-20 transition-all duration-500 ease-in-out transform ${
                isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
            } ${theme.container}`}
        >

            <div className={`flex items-center justify-between p-5 ${theme.header} shrink-0`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    {theme.icon}
                    <h3 className={`truncate ${theme.title}`}>
                        {neighborhoodName || (isGoTMode ? "Sin Feudo" : "Sin Barrio")}
                    </h3>
                </div>
                <button
                    onClick={onClose}
                    className={`p-2 rounded-full transition-colors shrink-0 ${theme.closeBtn}`}
                    title="Cerrar panel"
                >
                    <X size={20} />
                </button>
            </div>

            <div className={`flex-1 overflow-y-auto p-5 ${theme.scroll}`}>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                        <div className={`animate-spin ${theme.loaderColor}`}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <p className={`text-xs opacity-70 animate-pulse px-4 ${isGoTMode ? 'font-serif text-[#d4af37]' : 'text-slate-400'}`}>
                            {isGoTMode
                                ? "Los escribas están redactando el pergamino..."
                                : "La IA está analizando los datos del vecindario..."}
                        </p>
                    </div>
                ) : (
                    <div className={theme.body}>
                        <div className="animate-in fade-in duration-700">
                            {text ? text.split('\n').map((paragraph, idx) => (
                                paragraph.trim() && (
                                    <p key={idx} className="mb-3 last:mb-0">
                                        {paragraph}
                                    </p>
                                )
                            )) : (
                                <p className="opacity-50 italic text-center mt-10">
                                    {isGoTMode ? "Selecciona un feudo en el mapa." : "Selecciona un barrio para ver el análisis."}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {!isLoading && text && (
                <div className={`p-4 border-t shrink-0 ${isGoTMode ? 'border-[#d4af37]/20' : 'border-slate-700/50'}`}>
                    <button
                        onClick={onClose}
                        className={`w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                            isGoTMode
                                ? 'bg-[#2c1810] text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#3e2318] hover:border-[#d4af37]'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                    >
                        {isGoTMode ? "Cerrar Pergamino" : "Entendido"}
                    </button>
                </div>
            )}

        </div>
    );
};

export default JustificationModal;