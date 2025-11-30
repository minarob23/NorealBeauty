FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with cache mount to a safe location
# Use npm's cache directory instead of node_modules/.cache
RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
    npm ci --omit=dev

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
