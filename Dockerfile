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

# Start the application with database migrations (with timeout)
CMD npm run db:push -- --skip-generate && npm run db:migrate-products && npm start
