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
			<div className="flex items-center justify-between gap-6">
				<div className="flex flex-col items-center gap-6">
					<PasswordGenerator />
					<PassphraseGenerator />
					<HistoryList />
				</div>
				<div className="flex flex-col items-center gap-6">
					<SecurityTips />
				</div>
			</div>
		</div>
	)
}
