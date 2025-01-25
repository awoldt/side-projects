# Stage 1: Build
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy only the production build and necessary files from the builder stage
COPY --from=builder /app/build ./build
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci

# Expose the application port
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
