# Security Suite Manager

Applicazione web per generare password e passphrase sicure, valutare la loro entropia e tenere traccia delle ultime creazioni locali.

## Panoramica

Questo progetto è un piccolo tool di sicurezza pensato per aiutare a creare credenziali robuste in modo semplice e veloce. Include due generatori principali:

- Generatore di password tradizionali
- Generatore di passphrase con parole casuali

L’app mostra inoltre una stima dell’entropia e del tempo necessario per un eventuale brute-force, oltre a una cronologia locale delle ultime credenziali generate.

## Funzionalità

### Generatore password

- Lunghezza configurabile da 8 a 32 caratteri
- Selezione di minuscole, maiuscole, numeri e simboli
- Generazione sicura con `crypto.getRandomValues()`
- Calcolo dell’entropia in bit
- Stima del tempo di decifrazione
- Copia negli appunti
- Validazione: almeno un set di caratteri deve essere selezionato

### Generatore passphrase

- Numero di parole configurabile
- Selettore del separatore (`-`, `_`, `.`, spazio, `/`)
- Opzioni avanzate come:
  - iniziale maiuscola
  - numeri per parola
  - parole invertite
  - simbolo finale extra
- Generazione basata su un dizionario di parole
- Stima di sicurezza simile al generatore di password

### Extra

- Cronologia delle ultime credenziali salvata in `localStorage`
- Pulsante per svuotare la cronologia
- Suggerimenti pratici per la sicurezza
- Interfaccia a card con design dark moderno

## Stack tecnologico

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Jotai
- react-hook-form
- Biome

## Struttura del progetto

```text
password-generator/
├── public/
├── src/
│   ├── components/
│   │   ├── HistoryList.tsx
│   │   ├── PassphraseGenerator.tsx
│   │   ├── PasswordGenerator.tsx
│   │   └── SecurityTips.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── store.ts
│   ├── utils.ts
│   └── words.json
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── biome.json
└── README.md
```

## Requisiti

- Node.js 18+
- npm, pnpm o un package manager compatibile

## Installazione

```bash
npm install
# oppure
pnpm install
```

## Esecuzione in locale

```bash
npm run dev
# oppure
pnpm dev
```

L’app sarà disponibile di default su:

```text
http://localhost:5173
```

## Script disponibili

```bash
npm run dev      # avvia il server di sviluppo
npm run build    # compila l’app per produzione
npm run preview  # preview della build
npm run lint     # esegue il controllo statico con Biome
```

## Note sulla sicurezza

Questo tool è utile per generare credenziali forti, ma va usato con buon senso:

- non riutilizzare la stessa password su più servizi
- preferire password manager affidabili
- abilitare l’autenticazione a due fattori (2FA) dove possibile
- usare passphrase o password lunghe e uniche per account importanti

> Il progetto genera valori casuali tramite l’API Web Crypto del browser, che è una buona base per la sicurezza del lato client.

## Contributi

Se vuoi migliorare il progetto, puoi fare fork del repository, lavorare su una branch dedicata e aprire una pull request con le modifiche.

## Licenza

Non è presente un file di licenza nel repository. Verifica con il proprietario del progetto o con il tuo team prima di distribuirlo pubblicamente o in ambito aziendale.
