FROM node:18-alpine AS build

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

# Remove .env file and set API URL to empty string for Docker deployment
RUN rm -f .env .env.local
ENV VITE_API_URL=""

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
