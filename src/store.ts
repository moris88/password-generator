import { atomWithStorage } from "jotai/utils";

export interface HistoryItem {
  id: string;
  value: string;
  type: "password" | "passphrase";
  entropy: number;
  createdAt: string;
}

// Salvataggio persistente della cronologia nel localStorage
export const passwordHistoryAtom = atomWithStorage<HistoryItem[]>(
  "pwd_generator_history",
  [],
);
