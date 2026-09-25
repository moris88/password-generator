import { PasswordGenerator } from './components/PasswordGenerator';
import { PassphraseGenerator } from './components/PassphraseGenerator';
import { HistoryList } from './components/HistoryList';
import { SecurityTips } from './components/SecurityTips';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 flex flex-col items-center justify-start">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">Security Suite Manager</h1>
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
  );
}