# Backend Installation & Startup Guide

A Node.js/TypeScript backend application with PostgreSQL database, built with Express.js and Sequelize ORM.

## Prerequisites

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** (version 12 or higher) - [Download here](https://www.postgresql.org/download/)



## Quick Start:
1. Install Node.js and PostgreSQL
2. Run `npm install`
3. Create database `klontong_db`
4. Configure `.env` file
5. Run `npm run db:seed`
6. Run `npm run dev`
7. Check API at `http://localhost:3000/health`


## Installation

### 1. Clone and Setup

```bash
git clone https://github.com/muhFaza/brik-crud.git

cd brik-crud/backend

npm install
```

### 2. Database Setup

**Create PostgreSQL Database:**

```bash
# Connect to PostgreSQL (adjust credentials as needed)
psql -U postgres -h localhost

# Create the database
CREATE DATABASE klontong_db;

# Exit PostgreSQL
\q
```

**Alternative using pgAdmin or other GUI tools:**
- Create a new database named `klontong_db`

### 3. Environment Configuration

Create a `.env` file in the backend root directory:

**Configure your `.env` file:**

```env
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=klontong_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=secret
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Important:** Replace the following values:
- `DB_PASSWORD`: Your actual PostgreSQL password
- `JWT_SECRET`: A strong, unique secret key for JWT tokens

## Database Seeding

```bash
npm run db:seed
```

## Development

### Starting the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

Once the server is running, you can access the API at:
- Base URL: `http://localhost:3000`
- Health check: `http://localhost:3000/health`
