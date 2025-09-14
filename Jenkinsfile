version: '3.8'

services:
  mongo:
    image: mongo:latest
    ports:
      - "7500:27017"

  backend:
    build: ./backend
    image: backend-image
    ports:
      - "5000:5000"
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    image: frontend-image
    ports:
      - "9000:5173"
    depends_on:
      - backend
