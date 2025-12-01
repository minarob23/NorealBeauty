FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5000

# Start the application with database migrations
# Run migrations in background so app starts immediately
CMD bash -c "npm run db:push > /dev/null 2>&1 & npm run db:migrate-products > /dev/null 2>&1 & npm start"
