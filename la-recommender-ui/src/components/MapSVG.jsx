import React from 'react';
import { MOCK_NEIGHBORHOODS } from '../services/api'; // Importamos los datos para pintar el mapa

const MapSVG = ({ activeNeighborhood }) => {
    return (
        <div className="w-full h-full bg-slate-900 relative overflow-hidden group">
            <svg viewBox="0 0 800 600" className="w-full h-full opacity-30 pointer-events-none">
                <path d="M 0 300 Q 400 250 800 350" stroke="#334155" strokeWidth="20" fill="none" />
                <path d="M 450 0 L 500 600" stroke="#334155" strokeWidth="15" fill="none" />
                <path d="M 200 600 Q 250 300 100 0" stroke="#334155" strokeWidth="12" fill="none" />
                <circle cx="500" cy="280" r="100" fill="#1e293b" opacity="0.5" />
            </svg>

            <svg viewBox="0 0 800 600" className="absolute top-0 left-0 w-full h-full">
                {Object.values(MOCK_NEIGHBORHOODS).map((nb) => {
                    const isActive = activeNeighborhood?.id === nb.id;
                    return (
                        <g key={nb.id} className="transition-all duration-500 cursor-pointer hover:opacity-100">
                            <path
                                d={nb.polygon}
                                fill={isActive ? '#8b5cf6' : '#475569'}
                                fillOpacity={isActive ? 0.6 : 0.3}
                                stroke={isActive ? '#a78bfa' : '#94a3b8'}
                                strokeWidth={isActive ? 3 : 1}
                                className="transition-all duration-300"
                            />
                            {isActive && (
                                <text x={nb.center.x} y={nb.center.y} fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">
                                    {nb.name}
                                </text>
                            )}
                        </g>
                    )
                })}
            </svg>
            <div className="absolute bottom-4 right-4 bg-black/50 text-xs text-slate-400 p-2 rounded backdrop-blur-sm">
                Mapa Simplificado para Demo
            </div>
        </div>
    );
};

export default MapSVG;