import { HistoryList } from './components/HistoryList'
import { PassphraseGenerator } from './components/PassphraseGenerator'
import { PasswordGenerator } from './components/PasswordGenerator'
import { SecurityTips } from './components/SecurityTips'

export default function App() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-start bg-slate-950 px-4 py-10">
			<h1 className="mb-6 text-center font-bold text-2xl text-white">
				Security Suite Manager
			</h1>

			{/* Usiamo items-start per allineare in alto le due colonne */}
			<div className="flex w-full max-w-5xl items-start justify-between gap-6">

				{/* Colonna di sinistra (Generatori) */}
				<div className="flex flex-1 flex-col items-center gap-6">
					<PasswordGenerator />
					<PassphraseGenerator />
				</div>

				{/* Colonna di destra (SecurityTips + HistoryList) */}
				<div className="flex flex-1 flex-col items-center gap-6">
					<SecurityTips />
					<HistoryList />
				</div>

			</div>
		</div>
	)
}
