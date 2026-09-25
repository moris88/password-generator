import React from 'react';
import { useAtom } from 'jotai';
import { passwordHistoryAtom } from '../store';
import { getResultEntropia } from '../utils';

export const HistoryList: React.FC = () => {
  const [history, setHistory] = useAtom(passwordHistoryAtom);

  const clearHistory = () => {
    setHistory([]);
  };

  if (history.length === 0) return null;

  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-xl max-w-lg w-full border border-slate-800 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-200">Cronologia Recenti</h3>
        <button
          onClick={clearHistory}
          className="text-xs bg-red-900/40 hover:bg-red-900/60 text-red-300 px-2.5 py-1 rounded-lg border border-red-800/50 transition-colors"
        >
          Svuota Cronologia
        </button>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-slate-950 p-3 rounded-xl flex items-center justify-between text-sm border border-slate-800"
          >
            <div className="truncate mr-2">
              <span className="font-mono text-slate-300 block truncate">{item.value}</span>
              <span className="text-[10px] text-slate-500">
                {item.type.toUpperCase()} • {item.entropy} bits • {getResultEntropia(item.entropy).level} • {item.createdAt}
              </span>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(item.value)}
              className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 shrink-0"
            >
              Copia
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};