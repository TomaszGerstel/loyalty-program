# Stage 1: Build Angular app
FROM node:alpine AS build
WORKDIR /app
COPY package*.json ./
# COPY . /app
RUN npm install -g @angular/cli
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/loyalty-program /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]