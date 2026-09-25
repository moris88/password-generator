import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSetAtom } from 'jotai';
import { passwordHistoryAtom, type HistoryItem } from '../store';
import { calculateEntropy, getCrackTimeEstimate, getResultEntropia } from '../utils';

interface PasswordFormValues {
  length: number;
  includeLowercase: boolean;
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export const PasswordGenerator: React.FC = () => {
  const setHistory = useSetAtom(passwordHistoryAtom);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [entropy, setEntropy] = useState<number>(0);
  const [crackTime, setCrackTime] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string>('');

  const { register, handleSubmit, reset, control } = useForm<PasswordFormValues>({
    defaultValues: {
      length: 16,
      includeLowercase: true,
      includeUppercase: false,
      includeNumbers: false,
      includeSymbols: false,
    },
  });

  const currentLength = useWatch({ control, name: 'length' });

  const onSubmit = (data: PasswordFormValues) => {
    if (!data.includeLowercase && !data.includeUppercase && !data.includeNumbers && !data.includeSymbols) {
      setCustomError('Seleziona almeno un tipo di carattere.');
      return;
    }
    setCustomError('');

    let charset = '';
    let poolSize = 0;
    if (data.includeLowercase) { charset += 'abcdefghijklmnopqrstuvwxyz'; poolSize += 26; }
    if (data.includeUppercase) { charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; poolSize += 26; }
    if (data.includeNumbers) { charset += '0123456789'; poolSize += 10; }
    if (data.includeSymbols) { charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'; poolSize += 32; }

    let result = '';
    const array = new Uint32Array(data.length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < data.length; i++) {
      result += charset[array[i] % charset.length];
    }

    setGeneratedPassword(result);
    const calculated = calculateEntropy(data.length, poolSize);
    setEntropy(calculated);
    setCrackTime(getCrackTimeEstimate(calculated));

    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      value: result,
      type: 'password',
      entropy: calculated,
      createdAt: new Date().toLocaleTimeString(),
    };

    setHistory((prev) => [newItem, ...prev.slice(0, 19)]);
  };

  const handleReset = () => {
    reset({
      length: 16,
      includeLowercase: true,
      includeUppercase: false,
      includeNumbers: false,
      includeSymbols: false,
    });
    setGeneratedPassword('');
    setEntropy(0);
    setCrackTime('');
    setCustomError('');
  };

  const copyToClipboard = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-xl max-w-lg w-full border border-slate-800">
      <h2 className="text-xl font-bold mb-4 text-emerald-400">Generatore Password</h2>

      {/* Box Visualizzazione Password */}
      <div className="bg-slate-950 p-4 rounded-xl mb-6 flex items-center justify-between border border-slate-800 min-h-17.5">
        <span className="text-xl font-mono tracking-wider break-all text-emerald-300">
          {generatedPassword || '**********'}
        </span>
        {generatedPassword && (
          <button
            onClick={copyToClipboard}
            className="ml-3 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
          >
            {copied ? 'Copiato!' : 'Copia'}
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Input Range Lunghezza */}
        <div>
          <div className="flex justify-between text-sm mb-2 text-slate-300">
            <span>Lunghezza Caratteri</span>
            <span className="font-bold text-emerald-400">{currentLength}</span>
          </div>
          <input
            type="range"
            min="8"
            max="32"
            {...register('length', { valueAsNumber: true })}
            className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* Checkbox Opzioni */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <label className="flex items-center space-x-2 text-sm cursor-pointer">
            <input type="checkbox" {...register('includeLowercase')} className="rounded accent-emerald-500 w-4 h-4" />
            <span>Minuscole</span>
          </label>
          <label className="flex items-center space-x-2 text-sm cursor-pointer">
            <input type="checkbox" {...register('includeUppercase')} className="rounded accent-emerald-500 w-4 h-4" />
            <span>Maiuscole</span>
          </label>
          <label className="flex items-center space-x-2 text-sm cursor-pointer">
            <input type="checkbox" {...register('includeNumbers')} className="rounded accent-emerald-500 w-4 h-4" />
            <span>Numeri</span>
          </label>
          <label className="flex items-center space-x-2 text-sm cursor-pointer">
            <input type="checkbox" {...register('includeSymbols')} className="rounded accent-emerald-500 w-4 h-4" />
            <span>Speciali</span>
          </label>
        </div>

        {customError && <p className="text-red-400 text-xs mt-1">{customError}</p>}

        {/* Entropia e Tempo di Crack stimato */}
        {entropy > 0 && (
          <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <div>Entropia stimata: <strong className="text-emerald-400">{entropy} bits</strong>{' - '}Punteggio: <span className={getResultEntropia(entropy).color}>{getResultEntropia(entropy).level}</span></div>
            <div>Tempo stimato di decifrazione: <strong className="text-amber-400">{crackTime}</strong></div>
          </div>
        )}

        {/* Pulsanti Azione */}
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl transition-colors"
          >
            Genera Password
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 rounded-xl transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};