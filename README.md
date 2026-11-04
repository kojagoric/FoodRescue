# FoodRescue: Surplus Food Redistribution and Expiry Tracking System

## 1. Project Overview

FoodRescue is a database-driven application designed to support surplus food redistribution and expiry tracking.

The system connects food donors with recipient organisations and supports food batch management, collection requests, transportation and distribution tracking.

The application uses a Next.js frontend and API backend with a MySQL relational database.

## 2. Main Features

- Dashboard displaying project statistics.
- Donor management.
- Recipient organisation management.
- Food batch management.
- Collection request management.
- Transportation management.
- Distribution tracking.
- User authentication.
- CRUD operations through API routes.
- Food expiry tracking.

## 3. Technology Stack

- Frontend: Next.js and React
- Backend: Next.js API routes
- Database: MySQL
- Database driver: mysql2
- Authentication: jose and bcryptjs
- Runtime: Node.js

## 4. Database Design

The application uses six primary business tables:

1. DONOR
2. RECIPIENT_ORGANIZATION
3. FOOD_BATCH
4. COLLECTION_REQUEST
5. TRANSPORTATION
6. DISTRIBUTION

An additional USERS table supports application authentication.

### Relationships

- A donor can provide multiple food batches.
- A food batch can have multiple collection requests.
- A recipient organisation can submit multiple collection requests.
- A collection request can have associated transportation records.
- A collection request can have distribution records.
- A recipient organisation can receive multiple distributions.

Foreign-key constraints protect related records from accidental deletion.

## 5. Project Structure

```text
FoodRescue/
├── app/
│   ├── api/
│   └── application pages
├── lib/
│   ├── db.js
│   └── resources.js
├── scripts/
├── SQL/
│   ├── 29_DDL.SQL
│   ├── 30_INSERT_SAMPLE_DATA.SQL
│   ├── 31_ADVANCED_CONCEPTS.SQL
│   ├── 32_VALIDATION_AND_DEMO_QUERIES.SQL
│   └── 33_AUTH_SETUP.SQL
├── docs/
├── public/
├── .env.example
├── package.json
└── README.md
```

## 6. Installation and Setup

### Prerequisites

- Node.js 18.18 or later
- npm
- MySQL Server
- MySQL Workbench

### Clone the Repository

```bash
git clone https://github.com/kojagoric/FoodRescue.git
cd FoodRescue
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Copy `.env.example` to `.env.local`.

Configure the following values:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=foodrescue
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
AUTH_SECRET=YOUR_RANDOM_SECRET
```

Use your own database password and a secure authentication secret.

### Database Setup

Execute the SQL scripts in MySQL Workbench in this order:

1. `29_DDL.SQL`
2. `30_INSERT_SAMPLE_DATA.SQL`
3. `31_ADVANCED_CONCEPTS.SQL`
4. `32_VALIDATION_AND_DEMO_QUERIES.SQL`
5. `33_AUTH_SETUP.SQL`

Only execute the sample-data script when the business tables are empty.

### Create Administrator

```bash
npm run create-admin
```

### Start Development Server

```bash
npm run dev
```

Open `http://localhost:3000`.

## 7. API Operations

The API provides resource-based endpoints.

| Method | Operation |
|---|---|
| GET | Retrieve records |
| POST | Create records |
| PUT | Update individual records |
| DELETE | Delete individual records |

Main resources include donors, recipients, batches, requests, transportation and distributions.

Deletion is subject to database foreign-key restrictions. Records referenced by dependent records cannot be deleted until those dependencies are addressed.

## 8. Testing

The project is validated through:

- CRUD operation testing.
- API request and response testing.
- Foreign-key constraint validation.
- Record deletion testing.
- Application login and dashboard testing.

See `docs/API_Testing.md` for the executed API test cases and results.

## 9. Development Commands

```bash
npm run dev
npm run build
npm start
npm run lint
npm run create-admin
```

## 10. Repository

GitHub: https://github.com/kojagoric/FoodRescue
