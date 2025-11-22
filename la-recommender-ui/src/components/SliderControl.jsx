import React from 'react';

const SliderControl = ({ label, icon: Icon, value, onChange, isGoT }) => (
    <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
            <div className={`flex items-center gap-2 text-sm font-medium ${isGoT ? 'text-[#d4af37] font-got' : 'text-slate-300 font-sans'}`}>
                <Icon size={16} className={isGoT ? 'text-[#8a1c1c]' : 'text-violet-400'} />
                {label}
            </div>
            <span className={`text-xs ${isGoT ? 'text-[#cdcfd1]' : 'text-slate-500'}`}>{value}%</span>
        </div>
        <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            style={{ accentColor: isGoT ? '#d4af37' : '#8b5cf6' }}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-all ${isGoT ? 'bg-[#1f1b16] border border-[#d4af37]/30' : 'bg-slate-700'}`}
        />
    </div>
);

export default SliderControl;