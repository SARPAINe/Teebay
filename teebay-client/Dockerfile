# Base image
FROM node:latest

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all project files
COPY . .

# Expose port 5173
EXPOSE 5173