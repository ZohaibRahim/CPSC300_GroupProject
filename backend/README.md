# Markhor Backend API

Backend API for the AI-Powered Job Tracker application built with Node.js, Express, TypeScript, and PostgreSQL.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=markhor_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

JWT_SECRET=your_jwt_secret_key_here
```

### 3. Database Setup

1. Create a PostgreSQL database named `markhor_db` (or your preferred name)
2. Run the SQL schema files in order:
   - `src/models/users.sql`
   - `src/models/jobs.sql`
   - `src/models/applications.sql`

You can run them using psql:
```bash
psql -U your_db_user -d markhor_db -f src/models/users.sql
psql -U your_db_user -d markhor_db -f src/models/jobs.sql
psql -U your_db_user -d markhor_db -f src/models/applications.sql
```

### 4. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/signin` - Sign in with username/email and password

### Jobs
- `GET /api/jobs` - Get all jobs for authenticated user
- `GET /api/jobs/:id` - Get a specific job by ID
- `POST /api/jobs` - Create a new job
- `PUT /api/jobs/:id` - Update a job
- `DELETE /api/jobs/:id` - Delete a job

### Applications
- `GET /api/applications` - Get all applications for authenticated user
- `GET /api/applications/:id` - Get a specific application by ID
- `GET /api/applications/job/:jobId` - Get all applications for a specific job
- `POST /api/applications` - Create a new application
- `PUT /api/applications/:id` - Update an application
- `DELETE /api/applications/:id` - Delete an application

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database and configuration
│   ├── controllers/     # Business logic handlers
│   ├── middleware/      # Custom middleware (auth, validation)
│   ├── models/          # Database schemas and TypeScript interfaces
│   ├── routes/          # API route definitions
│   ├── utils/           # Helper functions
│   └── server.ts        # Express app entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Next Steps

1. Implement authentication logic in controllers (password hashing, JWT tokens)
2. Add validation middleware for request data
3. Implement database queries in controllers
4. Add error handling and validation
5. Set up authentication middleware to protect routes

