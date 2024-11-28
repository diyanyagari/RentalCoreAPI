# Use Node.js official image as base for the application
FROM node:16 AS app

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

COPY .env.dev /app/.env

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the database migrations
RUN npm run migration:run

# Build the application if needed (for example, React app or TypeScript)
RUN npm run build

# Now, use Nginx for reverse proxy and SSL
FROM nginx:alpine

# Copy the Nginx configuration file to the container
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy SSL certificates (make sure you have these certificates or use self-signed certificates)
COPY certificate.crt /etc/ssl/certs/
COPY private.key /etc/ssl/private/

# Copy the Node.js app build from the previous image
COPY --from=app dist /usr/share/nginx/html

# Expose port 443 for HTTPS
EXPOSE 443

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
