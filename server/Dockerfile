FROM node:latest

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Install PM2 globally
# RUN npm install -g pm2
RUN npm install -g nodemon

# Compile TypeScript files
# RUN npm run build

# Generate Prisma Client
RUN npx prisma generate --schema=./src/prisma/schema.prisma

# Expose port 4000
EXPOSE 4000
