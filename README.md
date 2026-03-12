# TAW Rezerwacje — System rezerwacji boisk i obiektów sportowych

Aplikacja webowa umożliwiająca rezerwację boisk i obiektów sportowych online. System pozwala użytkownikom wyszukiwać obiekty, przeglądać dostępne terminy i dokonywać rezerwacji, a właścicielom — zarządzać obiektami i kalendarzem wynajmu.

**Autorzy:** Michał Łata, Albert Gała

---

## Użyte technologie

| Warstwa      | Technologia                    |
| ------------ | ------------------------------ |
| Frontend     | React 19, Vite 7               |
| Backend      | Node.js, Express 5, TypeScript |
| Baza danych  | PostgreSQL                     |
| Linting      | ESLint 9 (flat config)         |
| Formatowanie | Prettier                       |

---

## Struktura projektu

```
TAW-Michal-Lata-Albert-Gala/
├── frontend/              # Konfiguracja ESLint + Prettier (root)
│   └── TAW-rezerwacje/    # Aplikacja React (Vite)
├── backend/               # API — Node.js + Express + TypeScript
├── docs/                  # Dokumentacja projektu
└── README.md
```

---

## Instrukcja uruchomienia

### Wymagania

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- [PostgreSQL](https://www.postgresql.org/) (do uruchomienia bazy danych)

### Frontend

```bash
cd frontend/TAW-rezerwacje
npm install
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:5173`.

### Backend

```bash
cd backend
npm install
npm run dev
```

Serwer API będzie dostępny pod adresem `http://localhost:3000`.

### Budowanie wersji produkcyjnej

```bash
# Frontend
cd frontend/TAW-rezerwacje
npm run build

# Backend
cd backend
npm run build
npm start
```

---

## Dostępne skrypty

| Skrypt           | Frontend              | Backend                |
| ---------------- | --------------------- | ---------------------- |
| `npm run dev`    | Serwer deweloperski   | Serwer z hot-reload    |
| `npm run build`  | Budowanie produkcyjne | Kompilacja TypeScript  |
| `npm run lint`   | ESLint                | ESLint                 |
| `npm run format` | —                     | Formatowanie Prettier  |
| `npm start`      | —                     | Uruchomienie z `dist/` |

---
