# Docker Deployment Notes

## Architecture

The application uses a multi-container Docker setup with nginx as a reverse proxy:

```
Browser → http://localhost:3000 → Nginx Container
                                      ↓
                                  /api/* → Backend Container (port 5000)
                                  /health → Backend Container (port 5000)
                                  /metrics → Backend Container (port 5000)
                                  /* → Static Files (React App)
```

## Important Configuration

### Frontend API URL

The frontend is built with `VITE_API_URL=""` (empty string) so it uses **relative paths**. This allows nginx to proxy all API requests to the backend:

- Frontend makes request to: `/api/auth/login`
- Nginx proxies to: `http://backend:5000/api/auth/login`

### Port Mapping

- **Frontend**: `localhost:3000` → nginx on port 80
- **Backend**: `localhost:5001` → backend on port 5000 (internal)
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`

Note: The backend port 5001 is only for direct API access outside Docker. Inside Docker, the frontend communicates with backend through nginx proxy.

## Demo Users

After running `docker exec taskmanager-backend node seeders/seed.js`:

- Email: `john@example.com` | Password: `password123`
- Email: `jane@example.com` | Password: `password123`

## Testing

### Test through nginx proxy (how frontend accesses backend)
```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Test backend directly
```bash
# Health check
curl http://localhost:5001/health

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## Rebuilding After Changes

### Backend changes
```bash
docker compose build backend
docker compose up -d backend
```

### Frontend changes
```bash
docker compose build frontend
docker compose up -d frontend
```

### Database schema changes
```bash
# Run migrations
docker exec taskmanager-backend node migrations/run-migrations.js

# Re-seed database
docker exec taskmanager-backend node seeders/seed.js
```

## Troubleshooting

### Login fails with network error
- Check that nginx is proxying correctly: `curl http://localhost:3000/health`
- Check backend is running: `docker ps | grep backend`
- Check backend logs: `docker logs taskmanager-backend`

### CORS errors
- The nginx proxy handles CORS - no CORS issues should occur when accessing through http://localhost:3000
- Direct access to http://localhost:5001 from browser may have CORS issues

### Database connection errors
- Verify PostgreSQL is healthy: `docker ps` (should show "healthy")
- Check connection from backend: `docker exec taskmanager-backend psql -h postgres -U postgres -d taskmanager -c "SELECT 1;"`

### Redis connection errors
- Verify Redis is healthy: `docker ps` (should show "healthy")
- Test Redis: `docker exec taskmanager-redis redis-cli ping`

## Clean Slate

To completely reset everything:

```bash
# Stop and remove containers, networks, and volumes
docker compose down -v

# Remove images
docker rmi taskmanager-frontend taskmanager-backend

# Start fresh
docker compose up -d

# Seed database
docker exec taskmanager-backend node seeders/seed.js
```
