import { useSetAtom } from 'jotai'
import type React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { type HistoryItem, passwordHistoryAtom } from '../store'
import {
	calculateEntropy,
	getCrackTimeEstimate,
	getResultEntropia,
	PASSPHRASE_WORDS,
	SEPARATORS,
} from '../utils'

interface PassphraseFormValues {
	wordCount: number
	separator: string
	capitalize: boolean
	addNumbers: boolean
	addSymbols: boolean
	reverseWords: boolean
}

export const PassphraseGenerator: React.FC = () => {
	const setHistory = useSetAtom(passwordHistoryAtom)
	const [generatedPassphrase, setGeneratedPassphrase] = useState<string>('')
	const [entropy, setEntropy] = useState<number>(0)
	const [crackTime, setCrackTime] = useState<string>('')
	const [copied, setCopied] = useState<boolean>(false)

	const { register, handleSubmit, reset } = useForm<PassphraseFormValues>({
		defaultValues: {
			wordCount: 6,
			separator: '-',
			capitalize: true,
			addNumbers: true,
			addSymbols: false,
			reverseWords: false,
		},
	})

	const onSubmit = (data: PassphraseFormValues) => {
		const selectedWords: string[] = []
		const array = new Uint32Array(data.wordCount * 2)
		window.crypto.getRandomValues(array)

		for (let i = 0; i < data.wordCount; i++) {
			let word = PASSPHRASE_WORDS[array[i] % PASSPHRASE_WORDS.length]

			// 1. Maiuscola come prima lettera
			if (data.capitalize) {
				word = word.charAt(0).toUpperCase() + word.slice(1)
			}

			// 2. Aggiunta numero subito prima del separatore (es. un numero da 0 a 99)
			if (data.addNumbers) {
				const randomNum = array[data.wordCount + i] % 100
				word = `${word}${randomNum}`
			}

			selectedWords.push(word)
		}

		// 3. Inversione ordine delle parole opzionale
		if (data.reverseWords) {
			selectedWords.reverse()
		}

		let result = selectedWords.join(data.separator)

		// 4. Aggiunta simbolo speciale finale extra opzionale
		if (data.addSymbols) {
			const symbols = '!@#$%^&*'
			const randomSym = symbols[array[0] % symbols.length]
			result = `${result}${randomSym}`
		}

		setGeneratedPassphrase(result)

		// Calcolo stimato dell'entropia aggiuntiva basata sulle opzioni attive
		let effectivePoolSize = PASSPHRASE_WORDS.length
		if (data.capitalize) effectivePoolSize *= 2 // raddoppia le combinazioni per ogni parola
		if (data.addNumbers) effectivePoolSize *= 100 // aggiunge fattore numerico
		if (data.addSymbols) effectivePoolSize *= 8

		const calculatedEntropy = calculateEntropy(
			data.wordCount,
			effectivePoolSize,
		)
		setEntropy(calculatedEntropy)
		setCrackTime(getCrackTimeEstimate(calculatedEntropy))

		const newItem: HistoryItem = {
			id: crypto.randomUUID(),
			value: result,
			type: 'passphrase',
			entropy: calculatedEntropy,
			createdAt: new Date().toLocaleTimeString(),
		}

		setHistory((prev) => [newItem, ...prev.slice(0, 19)])
	}

	const handleReset = () => {
		reset({
			wordCount: 6,
			separator: '-',
			capitalize: true,
			addNumbers: true,
			addSymbols: false,
			reverseWords: false,
		})
		setGeneratedPassphrase('')
		setEntropy(0)
		setCrackTime('')
	}

	const copyToClipboard = () => {
		if (!generatedPassphrase) return
		navigator.clipboard.writeText(generatedPassphrase)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className="mt-6 w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-xl">
			<h2 className="mb-4 font-bold text-sky-400 text-xl">
				Generatore Passphrase
			</h2>

			{/* Box Visualizzazione Passphrase */}
			<div className="mb-6 flex min-h-17.5 items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">
				<span className="break-all font-mono text-lg text-sky-300 tracking-wide">
					{generatedPassphrase || 'Parola-99-Parola-42'}
				</span>
				{generatedPassphrase && (
					<button
						type="button"
						onClick={copyToClipboard}
						className="ml-3 shrink-0 rounded-lg bg-sky-600 px-3 py-1.5 font-medium text-sm text-white transition-colors hover:bg-sky-500"
					>
						{copied ? 'Copiato!' : 'Copia'}
					</button>
				)}
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{/* Select Numero di Parole */}
				<div>
					<label
						htmlFor="wordCount"
						className="mb-1 block text-slate-300 text-sm"
					>
						Numero di parole
					</label>
					<select
						id="wordCount"
						{...register('wordCount', { valueAsNumber: true })}
						className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-200 text-sm focus:border-sky-500 focus:outline-none"
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
					<label
						htmlFor="separator"
						className="mb-1 block text-slate-300 text-sm"
					>
						Carattere Separatore
					</label>
					<select
						id="separator"
						{...register('separator')}
						className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-200 text-sm focus:border-sky-500 focus:outline-none"
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
					<label className="flex cursor-pointer items-center space-x-2 text-sm">
						<input
							type="checkbox"
							{...register('capitalize')}
							className="h-4 w-4 rounded accent-sky-500"
						/>
						<span>Maiuscola iniziale</span>
					</label>
					<label className="flex cursor-pointer items-center space-x-2 text-sm">
						<input
							type="checkbox"
							{...register('addNumbers')}
							className="h-4 w-4 rounded accent-sky-500"
						/>
						<span>Numeri per parola</span>
					</label>
					<label className="flex cursor-pointer items-center space-x-2 text-sm">
						<input
							type="checkbox"
							{...register('reverseWords')}
							className="h-4 w-4 rounded accent-sky-500"
						/>
						<span>Inverti parole</span>
					</label>
					<label className="flex cursor-pointer items-center space-x-2 text-sm">
						<input
							type="checkbox"
							{...register('addSymbols')}
							className="h-4 w-4 rounded accent-sky-500"
						/>
						<span>Simbolo finale extra</span>
					</label>
				</div>

				{/* Entropia e Tempo di Crack stimato */}
				{entropy > 0 && (
					<div className="space-y-1 rounded-lg border border-slate-800 bg-slate-950 p-3 text-slate-400 text-xs">
						<div>
							Entropia stimata:{' '}
							<strong className="text-sky-400">{entropy} bits</strong>
							{' - '}Punteggio:{' '}
							<span className={getResultEntropia(entropy).color}>
								{getResultEntropia(entropy).level}
							</span>
						</div>
						<div>
							Tempo stimato di decifrazione:{' '}
							<strong className="text-amber-400">{crackTime}</strong>
						</div>
					</div>
				)}

				{/* Pulsanti Azione */}
				<div className="flex space-x-3 pt-2">
					<button
						type="submit"
						className="flex-1 rounded-xl bg-sky-600 py-2.5 font-medium text-white transition-colors hover:bg-sky-500"
					>
						Genera Passphrase
					</button>
					<button
						type="button"
						onClick={handleReset}
						className="rounded-xl bg-slate-800 px-4 py-2.5 font-medium text-slate-300 transition-colors hover:bg-slate-700"
					>
						Reset
					</button>
				</div>
			</form>
		</div>
	)
}
