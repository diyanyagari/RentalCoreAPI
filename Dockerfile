# Use an official Node.js runtime as the base image
FROM node:16


# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./


COPY .env.dev /app/.env

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (update based on your app's config)
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
