# Use Node.js LTS
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . .

# Expose port
EXPOSE 5000

# Start backend
CMD ["npm", "run", "dev"]
