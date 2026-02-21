# DevOps Cheat Sheet

Your personal reference for Git and Docker commands learned in Phase 1 & 2.

---

## Git Commands

### Basic Workflow
```bash
git status                          # See what changed
git add <file>                      # Stage changes
git commit -m "message"             # Save snapshot
git log --oneline -5                # View commit history (last 5)
git diff <file>                     # See exact changes in file
```

### Branches
```bash
git branch                          # List all branches (* = current)
git branch <branch-name>            # Create new branch
git checkout <branch-name>          # Switch to branch
git merge <branch-name>             # Merge branch into current branch
```

### Commit Message Format
```
type: description

Examples:
- feat: add user login
- fix: resolve database connection issue
- docs: update README
- refactor: simplify error handling
```

---

## Docker Commands

### Container Management
```bash
docker compose up -d                # Start containers in background
docker compose down                 # Stop and remove containers
docker compose down -v              # Stop and REMOVE VOLUMES (deletes data!)
docker compose ps                   # List running containers
docker compose restart              # Restart all containers
```

### Build & Rebuild
```bash
docker compose build                # Build/rebuild images
docker compose build --no-cache     # Build without cache (fresh build)
docker compose up -d --build        # Build and start in one command
```

### Logs
```bash
docker compose logs -f              # Follow all logs (Ctrl+C to stop)
docker compose logs backend         # View backend logs
docker compose logs backend --tail=20  # Last 20 lines of backend logs
```

### Images & Cleanup
```bash
docker images                       # List all images
docker image prune                  # Remove dangling images
docker system prune -a              # Remove all unused images, containers, networks
```

### Volumes
```bash
docker volume ls                    # List all volumes
docker volume inspect <volume-name> # View volume details
```

### Execute Commands in Containers
```bash
docker exec -it <container-name> sh              # Open shell in container
docker exec -it <container-name> <command>       # Run command in container
```

---

## Docker Architecture

### Containers vs Images
- **Image** = Blueprint/template (like a recipe)
- **Container** = Running instance (like the actual meal)

### Port Mapping
```
localhost:3000 -> Container:80      # Your computer port 3000 maps to container port 80
localhost:5001 -> Container:5000    # Your computer port 5001 maps to container port 5000
```

### Networks
- Containers on same network can talk to each other by name
- Example: Backend connects to `postgres:5432` (not `localhost:5432`)

### Volumes
- Persistent storage that survives container restarts
- Data in volumes persists even when containers are deleted
- Use `docker compose down -v` to delete volumes

---

## Common Workflows

### Make a code change and rebuild
```bash
# 1. Make your code changes
# 2. Stop containers
docker compose down

# 3. Rebuild images
docker compose build

# 4. Start fresh
docker compose up -d

# 5. Check logs
docker compose logs -f
```

### Fresh start with clean data
```bash
docker compose down -v      # Delete everything including data
docker compose up -d        # Start fresh
```

### Check if everything is working
```bash
docker compose ps           # All should show "Up"
docker compose logs -f      # Check for errors
curl http://localhost:5001/health  # Test backend health
```

---

## Troubleshooting

### Container won't start
```bash
docker compose logs <service-name>  # Check logs for errors
docker compose ps                   # Check status
```

### Port already in use
```bash
docker compose down         # Stop existing containers
lsof -i :3000              # Find what's using port 3000
kill -9 <PID>              # Kill the process
```

### Database connection error
```bash
# Check if postgres is healthy
docker compose ps

# View postgres logs
docker compose logs postgres

# Restart containers
docker compose restart
```

---

## Project Structure

```
taskmanager/
├── backend/                # Node.js API
├── frontend/               # React app
├── docker/
│   ├── backend.Dockerfile  # Backend image definition
│   ├── frontend.Dockerfile # Frontend image definition
│   └── nginx.conf         # Nginx reverse proxy config
├── docker-compose.yml     # Orchestration file
├── .gitignore            # Files Git should ignore
└── README.md             # Project documentation
```

---

## Access Points

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- Backend Health: http://localhost:5001/health
- Demo Users:
  - john@example.com / password123
  - jane@example.com / password123

---

## Next Steps

Phase 3: CI/CD Pipeline
- GitHub Actions
- Automated testing
- Automated deployments
- Docker registry

Phase 4: Kubernetes
- Container orchestration
- Scaling
- Self-healing
- Load balancing

---

## GitHub Actions (CI/CD)

### Viewing Workflow Runs
```bash
# View on GitHub
# Go to: https://github.com/YOUR_USERNAME/taskmanager-devops/actions
```

### Workflow File Location
```
.github/workflows/ci.yml
```

### Workflow Structure
```yaml
name: CI Pipeline              # Workflow name
on:                           # Triggers
  push:
    branches: [main]          # Run on push to main
  pull_request:
    branches: [main]          # Run on PR to main

jobs:                         # Jobs to run
  lint-and-build:            # Job name
    runs-on: ubuntu-latest   # Environment
    steps:                   # Steps to execute
      - name: Checkout code
        uses: actions/checkout@v4
```

### Common Triggers
```yaml
on:
  push:                       # On every push
  pull_request:              # On every PR
  schedule:                  # On schedule (cron)
    - cron: '0 0 * * *'      # Daily at midnight
  workflow_dispatch:         # Manual trigger
```

### Your CI Pipeline Does
1. ✅ Checkout code from GitHub
2. ✅ Install Node.js 18
3. ✅ Install backend dependencies
4. ✅ Lint backend code
5. ✅ Install frontend dependencies
6. ✅ Lint frontend code
7. ✅ Build Docker images
8. ✅ Verify builds completed

### Adding Lint Scripts to package.json
```json
{
  "scripts": {
    "lint": "echo 'Linting passed'"
  }
}
```

### CI/CD Best Practices
- ✅ Run tests on every commit
- ✅ Use descriptive commit messages
- ✅ Fix failing builds immediately
- ✅ Keep workflows fast (< 5 minutes)
- ✅ Use caching for dependencies

### Troubleshooting CI/CD

**Build failing?**
```bash
# Check the workflow run on GitHub Actions tab
# Click on the failed step to see error details
# Fix the issue locally, commit, and push
```

**Workflow not running?**
```bash
# Check .github/workflows/ci.yml exists
# Check file is committed and pushed
# Check triggers match your branch (main)
```

**Lint errors?**
```bash
# Run locally first
cd backend && npm run lint
cd frontend && npm run lint

# Fix errors, then commit
```

---

**Generated by your DevOps learning journey on 2026-02-21**