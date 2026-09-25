import { useSetAtom } from 'jotai'
import type React from 'react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { type HistoryItem, passwordHistoryAtom } from '../store'
import {
	calculateEntropy,
	getCrackTimeEstimate,
	getResultEntropia,
} from '../utils'

interface PasswordFormValues {
	length: number
	includeLowercase: boolean
	includeUppercase: boolean
	includeNumbers: boolean
	includeSymbols: boolean
}

export const PasswordGenerator: React.FC = () => {
	const setHistory = useSetAtom(passwordHistoryAtom)
	const [generatedPassword, setGeneratedPassword] = useState<string>('')
	const [entropy, setEntropy] = useState<number>(0)
	const [crackTime, setCrackTime] = useState<string>('')
	const [copied, setCopied] = useState<boolean>(false)
	const [customError, setCustomError] = useState<string>('')

	const { register, handleSubmit, reset, control } =
		useForm<PasswordFormValues>({
			defaultValues: {
				length: 16,
				includeLowercase: true,
				includeUppercase: false,
				includeNumbers: false,
				includeSymbols: false,
			},
		})

	const currentLength = useWatch({ control, name: 'length' })

	const onSubmit = (data: PasswordFormValues) => {
		if (
			!data.includeLowercase &&
			!data.includeUppercase &&
			!data.includeNumbers &&
			!data.includeSymbols
		) {
			setCustomError('Seleziona almeno un tipo di carattere.')
			return
		}
		setCustomError('')

		let charset = ''
		let poolSize = 0
		if (data.includeLowercase) {
			charset += 'abcdefghijklmnopqrstuvwxyz'
			poolSize += 26
		}
		if (data.includeUppercase) {
			charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
			poolSize += 26
		}
		if (data.includeNumbers) {
			charset += '0123456789'
			poolSize += 10
		}
		if (data.includeSymbols) {
			charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'
			poolSize += 32
		}

		let result = ''
		const array = new Uint32Array(data.length)
		window.crypto.getRandomValues(array)
		for (let i = 0; i < data.length; i++) {
			result += charset[array[i] % charset.length]
		}

		setGeneratedPassword(result)
		const calculated = calculateEntropy(data.length, poolSize)
		setEntropy(calculated)
		setCrackTime(getCrackTimeEstimate(calculated))

		const newItem: HistoryItem = {
			id: crypto.randomUUID(),
			value: result,
			type: 'password',
			entropy: calculated,
			createdAt: new Date().toLocaleTimeString(),
		}

		setHistory((prev) => [newItem, ...prev.slice(0, 19)])
	}

	const handleReset = () => {
		reset({
			length: 16,
			includeLowercase: true,
			includeUppercase: false,
			includeNumbers: false,
			includeSymbols: false,
		})
		setGeneratedPassword('')
		setEntropy(0)
		setCrackTime('')
		setCustomError('')
	}

	const copyToClipboard = () => {
		if (!generatedPassword) return
		navigator.clipboard.writeText(generatedPassword)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-xl">
			<h2 className="mb-4 font-bold text-emerald-400 text-xl">
				Generatore Password
			</h2>

			{/* Box Visualizzazione Password */}
			<div className="mb-6 flex min-h-17.5 items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">
				<span className="break-all font-mono text-emerald-300 text-xl tracking-wider">
					{generatedPassword || '**********'}
				</span>
				{generatedPassword && (
					<button
						type="button"
						onClick={copyToClipboard}
						className="ml-3 shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 font-medium text-sm text-white transition-colors hover:bg-emerald-500"
					>
						{copied ? 'Copiato!' : 'Copia'}
					</button>
				)}
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				{/* Input Range Lunghezza */}
				<div>
					<div className="mb-2 flex justify-between text-slate-300 text-sm">
						<span>Lunghezza Caratteri</span>
						<span className="font-bold text-emerald-400">{currentLength}</span>
					</div>
					<input
						type="range"
						min="8"
						max="32"
						{...register('length', { valueAsNumber: true })}
						className="h-2 w-full cursor-pointer rounded-lg bg-slate-800 accent-emerald-500"
					/>
				</div>

				{/* Checkbox Opzioni */}
				<div className="grid grid-cols-2 gap-3 pt-2">
					<label className="flex cursor-pointer items-center space-x-2 text-sm">
						<input
							type="checkbox"
							{...register('includeLowercase')}
							className="h-4 w-4 rounded accent-emerald-500"
						/>
						<span>Minuscole</span>
					</label>
					<label className="flex cursor-pointer items-center space-x-2 text-sm">
						<input
							type="checkbox"
							{...register('includeUppercase')}
							className="h-4 w-4 rounded accent-emerald-500"
						/>
						<span>Maiuscole</span>
					</label>
					<label className="flex cursor-pointer items-center space-x-2 text-sm">
						<input
							type="checkbox"
							{...register('includeNumbers')}
							className="h-4 w-4 rounded accent-emerald-500"
						/>
						<span>Numeri</span>
					</label>
					<label className="flex cursor-pointer items-center space-x-2 text-sm">
						<input
							type="checkbox"
							{...register('includeSymbols')}
							className="h-4 w-4 rounded accent-emerald-500"
						/>
						<span>Speciali</span>
					</label>
				</div>

				{customError && (
					<p className="mt-1 text-red-400 text-xs">{customError}</p>
				)}

				{/* Entropia e Tempo di Crack stimato */}
				{entropy > 0 && (
					<div className="space-y-1 rounded-lg border border-slate-800 bg-slate-950 p-3 text-slate-400 text-xs">
						<div>
							Entropia stimata:{' '}
							<strong className="text-emerald-400">{entropy} bits</strong>
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
						className="flex-1 rounded-xl bg-emerald-600 py-2.5 font-medium text-white transition-colors hover:bg-emerald-500"
					>
						Genera Password
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
