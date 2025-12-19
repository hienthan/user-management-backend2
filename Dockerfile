# ============================================
# Backend Dockerfile (AdonisJS)
# ============================================
# This is a DEVELOPMENT Dockerfile optimized for hot-reload.
# For PRODUCTION, you would use multi-stage builds.

# ---- Base Image ----
# Using Node 20 Alpine (required for regex 'v' flag support in dependencies)
# The 'v' flag (unicodeSets) was introduced in Node.js 20.10.0
# Some AdonisJS dependencies (like @poppinss/cliui) require Node 20+
# Using Alpine for smaller image size (~50MB vs ~350MB for full Node)
FROM node:20-alpine

# ---- Install System Dependencies ----
# postgresql-client: Required for pg_isready command in wait-for-db.sh
# This allows the container to check if PostgreSQL is ready before starting the app
RUN apk add --no-cache postgresql-client

# ---- Set Working Directory ----
# All subsequent commands will run from /app
WORKDIR /app

# ---- Copy Dependency Files First ----
# Docker builds in layers. By copying package files first,
# Docker can cache the npm install step and skip it if dependencies haven't changed.
# This significantly speeds up rebuilds!
COPY package.json package-lock.json* ./

# ---- Install Dependencies ----
# Using npm ci would be better for CI/CD (faster, stricter)
# But npm install is fine for development
RUN npm install

# ---- Copy Source Code ----
# This layer changes frequently, so it comes AFTER npm install
# In development with docker-compose, this is overridden by the bind mount
COPY . .

# ---- Expose Port ----
# This is documentation - it doesn't actually publish the port
# The port is published via docker-compose's "ports" section
EXPOSE 3333

# ---- Default Command ----
# This can be overridden in docker-compose.yml
CMD ["npm", "run", "dev"]
