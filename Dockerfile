FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]

# FROM node:latest

# WORKDIR /usr/src/app

# COPY package*.json ./
# RUN npm install --build-from-source

# COPY . .

# EXPOSE 5000
# CMD ["npm", "start"]

