# 🚴 myBikeLog

**La tua bici, sempre al massimo.**

myBikeLog è un'applicazione web moderna per la gestione della manutenzione delle biciclette. Monitora l'usura dei componenti, ricevi notifiche di manutenzione e connetti Strava per sincronizzare automaticamente i tuoi chilometri.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-Proprietary-red)

## ✨ Features

- 🔐 **Autenticazione sicura** - Registrazione e login con Supabase Auth
- 🔗 **Integrazione Strava** - Importa automaticamente le tue bici con i km aggiornati
- 🔧 **Gestione componenti** - 14+ componenti predefiniti + possibilità di aggiungerne di personalizzati
- ⚙️ **Soglie configurabili** - Imposta soglie di manutenzione basate su km o ore
- 🔔 **Notifiche smart** - Ricevi avvisi quando un componente necessita attenzione
- 📊 **Dashboard intuitiva** - Visualizza lo stato di tutte le tue bici a colpo d'occhio
- 🌍 **Multilingua** - Italiano, Inglese, Francese, Spagnolo
- 📱 **Responsive** - Funziona perfettamente su desktop e mobile

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + Strava OAuth
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State**: Zustand + React Query
- **Forms**: React Hook Form + Zod
- **i18n**: next-intl
- **Deploy**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm o yarn
- Account Supabase
- Account Strava Developer (per le API)

### Installation

1. **Clona il repository**
   ```bash
   git clone https://github.com/yourusername/fixology.git
   cd fixology
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Configura le variabili d'ambiente**
   ```bash
   cp .env.example .env.local
   ```
   
   Compila il file `.env.local` con le tue credenziali:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_STRAVA_CLIENT_ID=your_strava_client_id
   STRAVA_CLIENT_SECRET=your_strava_client_secret
   NEXT_PUBLIC_STRAVA_REDIRECT_URI=http://localhost:3000/api/auth/strava/callback
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Configura Supabase**
   - Crea un nuovo progetto su [Supabase](https://supabase.com)
   - Vai su SQL Editor ed esegui lo schema contenuto in `supabase/schema.sql`
   - **Storage**: Crea un nuovo bucket pubblico chiamato `receipts` per permettere il caricamento delle ricevute di manutenzione.

5. **Configura Strava API**
   - Vai su [Strava Developers](https://developers.strava.com/)
   - Crea una nuova applicazione
   - Imposta il callback URL: `http://localhost:3000/api/auth/strava/callback`
   - Copia Client ID e Client Secret

6. **Avvia il server di sviluppo**
   ```bash
   npm run dev
   ```

7. Apri [http://localhost:3000](http://localhost:3000) nel browser

## 📁 Project Structure

```
fixology/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── login/             # Auth pages
│   │   └── register/
│   ├── components/            # React components
│   │   └── ui/               # Reusable UI components
│   ├── lib/                   # Utilities and services
│   │   ├── supabase/         # Supabase clients
│   │   └── strava/           # Strava service
│   ├── types/                 # TypeScript types
│   └── i18n/                  # Internationalization
├── messages/                   # Translation files
├── supabase/                   # Database schema
└── public/                     # Static assets
```

## 🗄️ Database Schema

- **profiles** - User profiles
- **strava_tokens** - OAuth tokens for Strava
- **bikes** - User bikes (synced from Strava or manual)
- **components** - Bike components with wear tracking
- **maintenance_logs** - History of maintenance actions
- **notifications** - User notifications

## 📱 Strava Integration

Fixology si integra con Strava per:

1. **Importare le bici** - Tutte le bici del tuo profilo Strava vengono importate automaticamente
2. **Sincronizzare i km** - I chilometri vengono aggiornati ad ogni sincronizzazione
3. **Token persistente** - Il token Strava viene salvato e refreshato automaticamente

## 🎨 Design System

L'app utilizza un design system moderno con:

- **Dark mode** di default
- **Glassmorphism** per le card
- **Gradienti** vibranti per gli accenti
- **Micro-animazioni** per feedback visivo
- **Colori semantici** per stati (ok, warning, danger)

## 📄 License

MIT License - vedi [LICENSE](LICENSE) per dettagli.

## 🤝 Contributing

Le pull request sono benvenute! Per modifiche importanti, apri prima un issue per discutere cosa vorresti cambiare.

---

Made with ❤️ for cyclists everywhere.

---

## 📄 Licenza

Copyright © 2026 Enrico. Tutti i diritti riservati.

Questo progetto è distribuito con una **licenza proprietaria**. È severamente vietata la copia, la modifica, la ridistribuzione o l'uso commerciale (anche parziale) del codice sorgente senza esplicito permesso scritto del proprietario. 

Il codice è reso pubblico su GitHub esclusivamente per scopi di consultazione e portfolio. Ogni abuso verrà perseguito a norma di legge.

Per informazioni o richieste di autorizzazione: [support@mybikelog.app](mailto:support@mybikelog.app)
