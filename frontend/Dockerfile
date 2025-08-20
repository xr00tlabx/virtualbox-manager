FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install serve to serve static files
RUN npm install -g serve

# Copy source code and index.html
COPY src/ ./src/
COPY index.html ./
COPY vite.config.js ./

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Serve the built app
CMD ["serve", "-s", "dist", "-l", "3000"]
