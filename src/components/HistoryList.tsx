import { useAtom } from 'jotai'
import type React from 'react'
import { passwordHistoryAtom } from '../store'
import { getResultEntropia } from '../utils'

export const HistoryList: React.FC = () => {
	const [history, setHistory] = useAtom(passwordHistoryAtom)

	const clearHistory = () => {
		setHistory([])
	}

	if (history.length === 0) return null

	return (
		<div className="mt-6 w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-xl">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="font-bold text-lg text-slate-200">Cronologia Recenti</h3>
				<button
					type="button"
					onClick={clearHistory}
					className="rounded-lg border border-red-800/50 bg-red-900/40 px-2.5 py-1 text-red-300 text-xs transition-colors hover:bg-red-900/60"
				>
					Svuota Cronologia
				</button>
			</div>
			<div className="max-h-68 space-y-2 overflow-y-auto pr-1">
				{history.map((item) => (
					<div
						key={item.id}
						className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm"
					>
						<div className="mr-2 truncate">
							<span className="block truncate font-mono text-slate-300">
								{item.value}
							</span>
							<span className="text-[10px] text-slate-500">
								{item.type.toUpperCase()} • {item.entropy} bits •{' '}
								{getResultEntropia(item.entropy).level} • {item.createdAt}
							</span>
						</div>
						<button
							type="button"
							onClick={() => navigator.clipboard.writeText(item.value)}
							className="shrink-0 rounded bg-slate-800 px-2 py-1 text-slate-300 text-xs hover:bg-slate-700"
						>
							Copia
						</button>
					</div>
				))}
			</div>
		</div>
	)
}
