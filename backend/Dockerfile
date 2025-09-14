FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY node_modules ./node_modules
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]
