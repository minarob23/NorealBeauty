FROM node:20-slim

WORKDIR /app

# Cache buster: 2025-12-01-image-upload-feature
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
CMD npm run db:push && npm run db:migrate-products && npm start
