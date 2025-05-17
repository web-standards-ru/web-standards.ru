FROM node:lts-alpine AS builder

# Install deps
WORKDIR /app
COPY . .
RUN apk add --no-cache git
RUN npm install
RUN npm run build


FROM nginx:stable-alpine AS prod

ARG NGINX_CONF=nginx.conf

COPY --from=builder /app/dist /var/www/web-standards.ru/html
COPY --from=builder /app/${NGINX_CONF} /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
