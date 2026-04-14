# Build mərhələsi
FROM node:18-alpine AS build

WORKDIR /app

# dependency install
COPY package*.json ./
RUN npm install

# project faylları
COPY . .

# build
RUN npm run build

# Production server (nginx)
FROM nginx:alpine

# build nəticəsini nginx-ə köçür
COPY --from=build /app/build /usr/share/nginx/html

# nginx default port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]