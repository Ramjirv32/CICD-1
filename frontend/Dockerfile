FROM node:latest as builder
WORKDIR /app
COPY package*.json ./
COPY node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
