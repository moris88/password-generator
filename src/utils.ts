import wordsData from "./words.json";

// Calcolo entropia approssimativo in bit: log2(poolSize ^ length)
export const calculateEntropy = (length: number, poolSize: number): number => {
  if (length <= 0 || poolSize <= 0) return 0;
  return Math.round(length * Math.log2(poolSize));
};

// Dizionario di parole di esempio per le passphrase
export const PASSPHRASE_WORDS: string[] = wordsData.passphraseWords;

export const SEPARATORS = [
  { label: "Trattino (-)", value: "-" },
  { label: "Underscore (_)", value: "_" },
  { label: "Punto (.)", value: "." },
  { label: "Spazio ( )", value: " " },
  { label: "Slash (/)", value: "/" },
];

// Funzione per stimare il tempo di brute-force basato sull'entropia (ipotizzando 10 miliardi di tentativi al secondo)
export const getCrackTimeEstimate = (entropyBits: number): string => {
  if (entropyBits <= 0) return '0 secondi';

  // 2^entropy combinazioni totali. Ipotizziamo 10^10 tentativi al secondo (hardware moderno)
  // Secondi = (2^entropy) / 10^10
  const seconds = Math.pow(2, entropyBits) / 10000000000;

  if (seconds < 1) return 'Istantaneo (Meno di 1 secondo)';
  if (seconds < 60) return `${Math.round(seconds)} secondi`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minuti`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} ore`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} giorni`;
  if (seconds < 31536000 * 1000) return `${Math.round(seconds / 31536000)} anni`;
  if (seconds < 31536000 * 1000000) return `${Math.round(seconds / (31536000 * 1000))} millenni`;

  return 'Praticamente impossibile';
};

export const getResultEntropia = (entropyBits: number): { level: string, color: string } => {
  if (entropyBits < 40) {
    return { level: "Debole", color: "text-red-400" };
  }
  if (entropyBits < 60) {
    return { level: "Discreta", color: "text-orange-400" };
  }
  if (entropyBits < 80) {
    return { level: "Forte", color: "text-amber-400" };
  }
  if (entropyBits < 100) {
    return { level: "Molto Forte", color: "text-green-400" };
  }
  return { level: "Estremamente Forte", color: "text-blue-400" };
};
