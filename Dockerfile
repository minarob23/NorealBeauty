FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy application code
COPY . .

# Build and run migrations
RUN npm run build && \
    npm run db:push && \
    npm run db:migrate-products

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
