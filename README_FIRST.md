# FoodRescue: start here

This is a starter implementation based on the progress checklist and the uploaded MySQL DDL.
It includes a MySQL-backed Next.js application, REST API, login/authentication, and a GitHub-ready README.

IMPORTANT:
- Your original files remain the source of truth for the six-table schema.
- The starter adds a `USERS` table for application login. Run `SQL/33_AUTH_SETUP.SQL` after the original DDL.
- It does NOT implement a second database paradigm. Your screenshot says one is required, but the official handout is needed to confirm which one.
- Do not claim the application works until you install dependencies, configure MySQL, run it, and test it.

## Phase 1: database

1. Put your original `29_DDL.SQL` in `SQL/`.
2. Run it in MySQL Workbench only if you are setting up a fresh database. If the database already exists and contains data, do not drop/recreate it.
3. Run `SQL/30_INSERT_SAMPLE_DATA.SQL` only if all six business tables are empty.
4. Run `SQL/31_ADVANCED_CONCEPTS.SQL` once.
5. Run `SQL/32_VALIDATION_AND_DEMO_QUERIES.SQL`.
6. Run `SQL/33_AUTH_SETUP.SQL` to create the application users table.

The SQL files 30–32 are from the separately supplied completion pack. Copy them into this project's `SQL/` folder.

## Phase 2: install the application

Install Node.js LTS (18.18+; preferably current LTS) and MySQL Server.
Open PowerShell in this project folder and run:

```powershell
npm install
Copy-Item .env.example .env.local
```

Edit `.env.local` with your actual MySQL host, port, database, username, password and a long random AUTH_SECRET.

Then create the first admin account:

```powershell
npm run create-admin
```

The script prompts for an email and password. Use a strong password and keep it private.

Start the app:

```powershell
npm run dev
```

Open http://localhost:3000 and log in using the admin credentials you just created.

## Phase 3: application features

- Dashboard: counts across the six business tables.
- Data pages: list and create records for donors, recipients, batches, requests, transportation and distributions.
- API: GET list, POST create, PUT update and DELETE by ID.
- Authentication: login/logout, password hashing, signed session cookie.
- Authorization: all data APIs require login; create/update/delete require an admin or staff role.

This is a starter CRUD app, not a polished production system. It does not yet include a full edit form, role-management UI, password-reset flow, deployment, or automated test suite.

## Phase 4: GitHub (do this after local verification)

1. Create a private GitHub repository named `foodrescue`.
2. Do not upload `.env.local`, passwords, database dumps, or personal data.
3. In PowerShell:

```powershell
git init
git add .
git commit -m "Initial FoodRescue implementation"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/foodrescue.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. If you already have a repository, do not run `git init` or add a second remote blindly; inspect `git remote -v` first.

## Phase 5: before submission

- Confirm the official rubric and second-paradigm requirement.
- Update ER and relational diagrams so they match the actual DDL.
- Add genuine screenshots of successful SQL execution and application pages.
- Test valid and invalid operations.
- Write the final report from actual implemented results.
- Ensure both teammates understand and can demonstrate the whole workflow.
