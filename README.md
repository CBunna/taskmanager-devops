# Task Manager - Full-Stack Web Application

A production-ready Task Manager application built with React, Node.js, PostgreSQL, and Redis. Features include JWT authentication, Kanban board interface, health monitoring, and Prometheus metrics.

## Features

### Frontend (React + Tailwind CSS)
- User authentication (Login/Register) with JWT
- Kanban board dashboard (Todo, In Progress, Done)
- Create, edit, and delete tasks with:
  - Title and description
  - Priority levels (low, medium, high)
  - Due dates
  - Status tracking
- User profile management
- Health check page showing system status
- Responsive design (mobile + desktop)
- Environment variable configuration

### Backend (Node.js + Express)
- RESTful API with the following routes:
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login
  - `GET /api/tasks` - Get all tasks for current user
  - `GET /api/tasks/:id` - Get single task
  - `POST /api/tasks` - Create new task
  - `PUT /api/tasks/:id` - Update task
  - `DELETE /api/tasks/:id` - Delete task
  - `GET /api/users/me` - Get current user profile
  - `PUT /api/users/me` - Update user profile
  - `GET /health` - Health check endpoint
  - `GET /metrics` - Prometheus metrics endpoint
- JWT authentication middleware
- Input validation with Joi
- Rate limiting with express-rate-limit
- Security headers with Helmet.js
- Structured JSON logging with Winston
- PostgreSQL database with Sequelize ORM
- Redis for session/cache management

### Database
- PostgreSQL with three tables:
  - `users` - User accounts
  - `tasks` - Task items
  - `sessions` - User sessions
- Migration scripts
- Seed data for development

## Project Structure

```
taskmanager/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── contexts/      # React contexts
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/           # Node.js API
│   ├── config/            # Database and Redis config
│   │   ├── database.js
│   │   └── redis.js
│   ├── models/            # Sequelize models
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── Session.js
│   │   └── index.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   ├── users.js
│   │   ├── health.js
│   │   └── metrics.js
│   ├── middleware/        # Express middleware
│   │   ├── auth.js
│   │   └── validation.js
│   ├── migrations/        # Database migrations
│   ├── seeders/           # Seed data scripts
│   ├── utils/             # Utility functions
│   │   └── logger.js
│   ├── server.js
│   └── package.json
├── docker/            # Dockerfiles
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── nginx.conf
├── k8s/               # Kubernetes manifests (placeholder)
├── terraform/         # Terraform IaC (placeholder)
├── .github/           # GitHub Actions (placeholder)
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (for containerized deployment)

## Environment Variables

### Backend (.env)
```bash
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskmanager
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000
```

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to backend
cd taskmanager/backend
cp .env.example .env
npm install

# Navigate to frontend
cd ../frontend
cp .env.example .env
npm install
```

### 2. Start PostgreSQL and Redis

```bash
# Using Docker
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

### 3. Run Database Migrations

```bash
cd backend
npm run migrate
```

### 4. Seed Database (Optional)

```bash
npm run seed
```

This creates two demo users:
- `john@example.com / password123`
- `jane@example.com / password123`

### 5. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Access the application at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health
- Metrics: http://localhost:5000/metrics

## Docker Deployment

### Using Docker Compose

```bash
cd taskmanager

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001 (mapped from container port 5000)
- PostgreSQL: localhost:5432
- Redis: localhost:6379

**Note**: Backend runs on port 5001 in Docker to avoid conflicts. Update `VITE_API_URL` in frontend `.env` to `http://localhost:5001` when using Docker.

### Building Individual Images

```bash
# Backend
docker build -f docker/backend.Dockerfile -t taskmanager-backend .

# Frontend
docker build -f docker/frontend.Dockerfile -t taskmanager-frontend .
```

## API Documentation

### Authentication

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Tasks (Requires Authentication)

#### Get All Tasks
```bash
GET /api/tasks
Authorization: Bearer <token>
```

#### Create Task
```bash
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task manager app",
  "status": "todo",
  "priority": "high",
  "dueDate": "2024-12-31"
}
```

#### Update Task
```bash
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "done"
}
```

#### Delete Task
```bash
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

### User Profile (Requires Authentication)

#### Get Profile
```bash
GET /api/users/me
Authorization: Bearer <token>
```

#### Update Profile
```bash
PUT /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

### Health & Metrics

#### Health Check
```bash
GET /health

Response:
{
  "status": "healthy",
  "uptime": 3600,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "db": "connected",
  "redis": "connected",
  "responseTime": "15ms"
}
```

#### Prometheus Metrics
```bash
GET /metrics
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Helmet.js security headers
- Rate limiting to prevent abuse
- Input validation with Joi
- SQL injection prevention (Sequelize ORM)
- Environment variable management
- CORS configuration

## Production Deployment Checklist

- [ ] Change `JWT_SECRET` to a strong, random value
- [ ] Update database credentials
- [ ] Configure CORS to allow only your domain
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL
- [ ] Set up database backups
- [ ] Configure Redis persistence
- [ ] Set up monitoring and alerting
- [ ] Review and adjust rate limits
- [ ] Set up log aggregation
- [ ] Configure firewall rules
- [ ] Enable database connection pooling
- [ ] Set up CDN for static assets
- [ ] Configure auto-scaling (if using cloud)

## Future Enhancements

- Kubernetes deployment manifests
- Terraform infrastructure as code
- CI/CD pipelines with GitHub Actions
- Task assignment and collaboration
- Real-time updates with WebSockets
- File attachments for tasks
- Task comments and activity history
- Email notifications
- Calendar integration
- Advanced filtering and search
- Task templates
- Analytics dashboard

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View PostgreSQL logs
docker logs taskmanager-postgres
```

### Redis Connection Issues
```bash
# Check if Redis is running
docker ps | grep redis

# Test Redis connection
redis-cli ping
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
