import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSetAtom } from 'jotai';
import { passwordHistoryAtom, type HistoryItem } from '../store';
import { PASSPHRASE_WORDS, SEPARATORS, calculateEntropy, getCrackTimeEstimate, getResultEntropia } from '../utils';

interface PassphraseFormValues {
  wordCount: number;
  separator: string;
  capitalize: boolean;
  addNumbers: boolean;
  addSymbols: boolean;
  reverseWords: boolean;
}

export const PassphraseGenerator: React.FC = () => {
  const setHistory = useSetAtom(passwordHistoryAtom);
  const [generatedPassphrase, setGeneratedPassphrase] = useState<string>('');
  const [entropy, setEntropy] = useState<number>(0);
  const [crackTime, setCrackTime] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const { register, handleSubmit, reset } = useForm<PassphraseFormValues>({
    defaultValues: {
      wordCount: 6,
      separator: '-',
      capitalize: true,
      addNumbers: true,
      addSymbols: false,
      reverseWords: false,
    },
  });

  const onSubmit = (data: PassphraseFormValues) => {
    const selectedWords: string[] = [];
    const array = new Uint32Array(data.wordCount * 2);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < data.wordCount; i++) {
      let word = PASSPHRASE_WORDS[array[i] % PASSPHRASE_WORDS.length];

      // 1. Maiuscola come prima lettera
      if (data.capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }

      // 2. Aggiunta numero subito prima del separatore (es. un numero da 0 a 99)
      if (data.addNumbers) {
        const randomNum = array[data.wordCount + i] % 100;
        word = `${word}${randomNum}`;
      }

      selectedWords.push(word);
    }

    // 3. Inversione ordine delle parole opzionale
    if (data.reverseWords) {
      selectedWords.reverse();
    }

    let result = selectedWords.join(data.separator);

    // 4. Aggiunta simbolo speciale finale extra opzionale
    if (data.addSymbols) {
      const symbols = '!@#$%^&*';
      const randomSym = symbols[array[0] % symbols.length];
      result = `${result}${randomSym}`;
    }

    setGeneratedPassphrase(result);

    // Calcolo stimato dell'entropia aggiuntiva basata sulle opzioni attive
    let effectivePoolSize = PASSPHRASE_WORDS.length;
    if (data.capitalize) effectivePoolSize *= 2; // raddoppia le combinazioni per ogni parola
    if (data.addNumbers) effectivePoolSize *= 100; // aggiunge fattore numerico
    if (data.addSymbols) effectivePoolSize *= 8;

    const calculatedEntropy = calculateEntropy(data.wordCount, effectivePoolSize);
    setEntropy(calculatedEntropy);
    setCrackTime(getCrackTimeEstimate(calculatedEntropy));

    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      value: result,
      type: 'passphrase',
      entropy: calculatedEntropy,
      createdAt: new Date().toLocaleTimeString(),
    };

    setHistory((prev) => [newItem, ...prev.slice(0, 19)]);
  };

  const handleReset = () => {
    reset({
      wordCount: 6,
      separator: '-',
      capitalize: true,
      addNumbers: true,
      addSymbols: false,
      reverseWords: false,
    });
    setGeneratedPassphrase('');
    setEntropy(0);
    setCrackTime('');
  };

  const copyToClipboard = () => {
    if (!generatedPassphrase) return;
    navigator.clipboard.writeText(generatedPassphrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-xl max-w-lg w-full border border-slate-800 mt-6">
      <h2 className="text-xl font-bold mb-4 text-sky-400">Generatore Passphrase</h2>

      {/* Box Visualizzazione Passphrase */}
      <div className="bg-slate-950 p-4 rounded-xl mb-6 flex items-center justify-between border border-slate-800 min-h-17.5">
        <span className="text-lg font-mono tracking-wide break-all text-sky-300">
          {generatedPassphrase || 'Parola-99-Parola-42'}
        </span>
        {generatedPassphrase && (
          <button
            onClick={copyToClipboard}
            className="ml-3 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
          >
            {copied ? 'Copiato!' : 'Copia'}
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Select Numero di Parole */}
        <div>
          <label className="block text-sm text-slate-300 mb-1">Numero di parole</label>
          <select
            {...register('wordCount', { valueAsNumber: true })}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-sky-500"
          >
            <option value={4}>4 Parole</option>
            <option value={5}>5 Parole</option>
            <option value={6}>6 Parole (Consigliato)</option>
            <option value={7}>7 Parole</option>
            <option value={8}>8 Parole</option>
            <option value={10}>10 Parole (Massima sicurezza)</option>
          </select>
        </div>

        {/* Select Carattere Separatore */}
        <div>
          <label className="block text-sm text-slate-300 mb-1">Carattere Separatore</label>
          <select
            {...register('separator')}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-sky-500"
          >
            {SEPARATORS.map((sep) => (
              <option key={sep.value} value={sep.value}>
                {sep.label}
              </option>
            ))}
          </select>
        </div>

        {/* Checkbox Opzioni Avanzate di Complessità */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <label className="flex items-center space-x-2 text-sm cursor-pointer">
            <input type="checkbox" {...register('capitalize')} className="rounded accent-sky-500 w-4 h-4" />
            <span>Maiuscola iniziale</span>
          </label>
          <label className="flex items-center space-x-2 text-sm cursor-pointer">
            <input type="checkbox" {...register('addNumbers')} className="rounded accent-sky-500 w-4 h-4" />
            <span>Numeri per parola</span>
          </label>
          <label className="flex items-center space-x-2 text-sm cursor-pointer">
            <input type="checkbox" {...register('reverseWords')} className="rounded accent-sky-500 w-4 h-4" />
            <span>Inverti parole</span>
          </label>
          <label className="flex items-center space-x-2 text-sm cursor-pointer">
            <input type="checkbox" {...register('addSymbols')} className="rounded accent-sky-500 w-4 h-4" />
            <span>Simbolo finale extra</span>
          </label>
        </div>

        {/* Entropia e Tempo di Crack stimato */}
        {entropy > 0 && (
          <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <div>Entropia stimata: <strong className="text-sky-400">{entropy} bits</strong>
              {' - '}Punteggio: <span className={getResultEntropia(entropy).color}>{getResultEntropia(entropy).level}</span>
            </div>
            <div>Tempo stimato di decifrazione: <strong className="text-amber-400">{crackTime}</strong></div>
          </div>
        )}

        {/* Pulsanti Azione */}
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-medium py-2.5 rounded-xl transition-colors"
          >
            Genera Passphrase
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