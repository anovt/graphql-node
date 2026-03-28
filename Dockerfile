# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Command to run the application with nodemon
# The code itself is not copied here, but mounted via docker-compose
CMD ["npm", "start"]