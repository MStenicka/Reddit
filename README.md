# Reddit Clone Project (backend)

Tento projekt je základní implementací sociálního média podobného Reddit. Umožňuje uživatelům vytvářet, prohlížet a upvotovat/downvotovat příspěvky.

## Instalace

1. Klonujte tento repozitář na svůj lokální počítač.
2. Nainstalujte závislosti pomocí příkazu `npm install`.

## Konfigurace

1. Vytvořte soubor `.env` v kořenovém adresáři projektu.
2. Nastavte proměnné prostředí pro připojení k databázi MySQL a SMTP serveru.

## Spuštění

1. Spusťte server pomocí příkazu `npm start`.
2. Server by měl běžet na adrese `http://localhost:3000`.

## API Endpoints

- `POST /register`: Registrace uživatele. Po úspěšné registraci se odešle potvrzovací e-mail.
- `POST /login`: Přihlášení uživatele a získání JWT tokenu.
- `POST /posts`: Vytvoření nového příspěvku.
- `GET /posts`: Získání seznamu všech příspěvků.
- `GET /posts/:id`: Získání detailu konkrétního příspěvku.
- `PUT /posts/:id/upvote`: Upvotování příspěvku.
- `PUT /posts/:id/downvote`: Downvotování příspěvku.
- `DELETE /posts/:id`: Smazání příspěvku.
- `PUT /posts/:id`: Úprava příspěvku.

## E-mailové potvrzení registrace

Při úspěšné registraci je odeslán potvrzovací e-mail na zadanou e-mailovou adresu.
