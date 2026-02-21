# Quick Start Guide

## Using Docker (Recommended)

The fastest way to get the application running is with Docker Compose:

### 1. Start All Services

```bash
cd taskmanager
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Redis cache on port 6379
- Backend API on port 5001
- Frontend app on port 3000

### 2. Run Database Migrations

The migrations run automatically when the backend container starts.

### 3. (Optional) Seed the Database

To add demo data:

```bash
docker exec taskmanager-backend node seeders/seed.js
```

This creates two demo users:
- `john@example.com` / `password123`
- `jane@example.com` / `password123`

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health
- **Metrics**: http://localhost:5001/metrics

### 5. Check Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 6. Stop Services

```bash
# Stop but keep data
docker-compose down

# Stop and remove all data
docker-compose down -v
```

## Local Development (Without Docker)

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### 1. Start PostgreSQL and Redis

Using Docker:
```bash
docker run -d --name taskmanager-postgres \
  -e POSTGRES_DB=taskmanager \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

docker run -d --name taskmanager-redis \
  -p 6379:6379 \
  redis:7-alpine
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run migrate
npm run seed  # Optional: adds demo data
npm run dev
```

### 3. Setup Frontend

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Testing the API

### Register a New User

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the returned token for authenticated requests.

### Create a Task

```bash
curl -X POST http://localhost:5001/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Task",
    "description": "This is a test",
    "priority": "high",
    "status": "todo",
    "dueDate": "2024-12-31"
  }'
```

### Get All Tasks

```bash
curl -X GET http://localhost:5001/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Port Already in Use

If port 5001 is already in use, edit `docker-compose.yml` and change:
```yaml
ports:
  - "5002:5000"  # Use 5002 instead
```

### Database Connection Error

Make sure PostgreSQL is running:
```bash
docker ps | grep postgres
```

### Redis Connection Error

Make sure Redis is running:
```bash
docker ps | grep redis
```

### Frontend Can't Connect to Backend

Check that `frontend/.env` has the correct API URL:
```bash
VITE_API_URL=http://localhost:5001
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize the JWT secret in production
- Set up CI/CD pipelines
- Deploy to your cloud provider
- Add Kubernetes manifests
- Configure monitoring and alerting
