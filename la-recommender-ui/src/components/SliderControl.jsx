import React from 'react';

const SliderControl = ({ label, icon: Icon, value, onChange }) => (
    <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                <Icon size={16} className="text-violet-400" />
                {label}
            </div>
            <span className="text-xs text-slate-500">{value}%</span>
        </div>
        <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500 hover:accent-violet-400 transition-all"
        />
    </div>
);

export default SliderControl;