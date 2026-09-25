import React from 'react';

export const SecurityTips: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-xl max-w-lg w-full border border-slate-800 mt-6">
      <h2 className="text-xl font-bold mb-4 text-amber-400 flex items-center gap-2">
        <span>💡</span> Consigli per la Sicurezza
      </h2>

      <div className="space-y-4 text-sm text-slate-300">
        {/* Sezione Password */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <h3 className="font-semibold text-emerald-400 mb-1">Per le Password Tradizionali</h3>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
            <li>Usa una lunghezza minima di <strong>16 caratteri</strong> per account importanti.</li>
            <li>Combina sempre maiuscole, minuscole, numeri e simboli per massimizzare il pool.</li>
            <li>Evita parole di senso compiuto o date di nascita facilmente deducibili.</li>
          </ul>
        </div>

        {/* Sezione Passphrase */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <h3 className="font-semibold text-sky-400 mb-1">Per le Passphrase</h3>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
            <li>Preferisci almeno <strong>6 a 8 parole</strong> estratte da un dizionario ampio.</li>
            <li>Attiva la maiuscola iniziale e i numeri per incrementare drasticamente l'entropia.</li>
            <li>Sono più facili da ricordare a mente ma estremamente resistenti al brute-force.</li>
          </ul>
        </div>

        {/* Regole Generali */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <h3 className="font-semibold text-amber-300 mb-1">Regole d'Oro</h3>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
            <li>Non riutilizzare mai la stessa password o passphrase su più siti.</li>
            <li>Affidati a un Password Manager sicuro per archiviare le tue chiavi.</li>
            <li>Abilita sempre l'Autenticazione a Due Fattori (2FA) dove disponibile.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};