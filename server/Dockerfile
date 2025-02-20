FROM node:latest

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Install PM2 globally
RUN npm install -g pm2

# Compile TypeScript files
RUN npm run build

# Generate Prisma Client
RUN npx prisma generate --schema=./src/prisma/schema.prisma

# Copy .env file
COPY .env ./

# Expose port 4000
EXPOSE 4000

# Command to run the application and run migrations
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./src/prisma/schema.prisma && pm2-runtime start dist/index.js --env development"]
