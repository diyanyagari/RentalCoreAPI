# =====================NGINX SETTINGS=====================

# # Use Node.js official image as base for the application
# FROM node:16 AS app

# # Set the working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json to the container
# COPY package*.json ./

# COPY .env.dev /app/.env

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Run the database migrations
# RUN npm run migration:run

# # Build the application if needed (for example, React app or TypeScript)
# RUN npm run build

# # Now, use Nginx for reverse proxy and SSL
# FROM nginx:alpine

# # Copy the Nginx configuration file to the container
# COPY nginx/nginx.conf /etc/nginx/nginx.conf

# # Copy SSL certificates (make sure you have these certificates or use self-signed certificates)
# COPY certificate.crt /etc/nginx/certificates/fullchain.pem
# COPY private.key /etc/nginx/certificates/privkey.pem

# # Copy the Node.js app build from the previous image
# # COPY --from=app dist /usr/share/nginx/html
# COPY dist /usr/share/nginx/html

# # Expose port 443 for HTTPS
# EXPOSE 443

# # Start Nginx server
# CMD ["nginx", "-g", "daemon off;"]



# =====================COMMON SETTINGS=====================
# Use an official Node.js runtime as the base image
FROM node:16


# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Use a build argument to specify the environment file
ARG ENV_FILE=.env.dev
COPY ${ENV_FILE} /app/.env

# Install dependencies
RUN npm install

RUN npm run migration:run

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (update based on your app's config)
EXPOSE 3000

# Run the app
CMD ["npm", "start"]