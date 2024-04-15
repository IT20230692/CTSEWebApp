FROM node:16

# Create a non-root user to run the application
RUN useradd -r -u 1001 appuser
USER appuser

WORKDIR /app

# Copy package.json and package-lock.json separately to leverage Docker layer caching
COPY package*.json ./
RUN npm install --production

# Copy application files
COPY . .

# Expose port
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
