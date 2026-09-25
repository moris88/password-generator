import type React from 'react'

export const SecurityTips: React.FC = () => {
	return (
		<div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-xl">
			<h2 className="mb-4 flex items-center gap-2 font-bold text-amber-400 text-xl">
				<span>💡</span> Consigli per la Sicurezza
			</h2>

			<div className="space-y-4 text-slate-300 text-sm">
				{/* Sezione Password */}
				<div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
					<h3 className="mb-1 font-semibold text-emerald-400">
						Per le Password Tradizionali
					</h3>
					<ul className="list-inside list-disc space-y-1 text-slate-400 text-xs">
						<li>
							Usa una lunghezza minima di <strong>16 caratteri</strong> per
							account importanti.
						</li>
						<li>
							Combina sempre maiuscole, minuscole, numeri e simboli per
							massimizzare il pool.
						</li>
						<li>
							Evita parole di senso compiuto o date di nascita facilmente
							deducibili.
						</li>
					</ul>
				</div>

				{/* Sezione Passphrase */}
				<div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
					<h3 className="mb-1 font-semibold text-sky-400">Per le Passphrase</h3>
					<ul className="list-inside list-disc space-y-1 text-slate-400 text-xs">
						<li>
							Preferisci almeno <strong>6 a 8 parole</strong> estratte da un
							dizionario ampio.
						</li>
						<li>
							Attiva la maiuscola iniziale e i numeri per incrementare
							drasticamente l'entropia.
						</li>
						<li>
							Sono più facili da ricordare a mente ma estremamente resistenti al
							brute-force.
						</li>
					</ul>
				</div>

				{/* Regole Generali */}
				<div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
					<h3 className="mb-1 font-semibold text-amber-300">Regole d'Oro</h3>
					<ul className="list-inside list-disc space-y-1 text-slate-400 text-xs">
						<li>
							Non riutilizzare mai la stessa password o passphrase su più siti.
						</li>
						<li>
							Affidati a un Password Manager sicuro per archiviare le tue
							chiavi.
						</li>
						<li>
							Abilita sempre l'Autenticazione a Due Fattori (2FA) dove
							disponibile.
						</li>
					</ul>
				</div>
			</div>
		</div>
	)
}
