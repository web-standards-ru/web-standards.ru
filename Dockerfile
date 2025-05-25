FROM node:lts-alpine AS builder

# Install deps
WORKDIR /app
COPY . .
RUN apk add --no-cache git
RUN npm install
RUN npm run build


FROM nginx:stable-alpine AS prod

ARG NGINX_CONF=nginx.conf
ARG NGINX_LOCAL=nginx.local.conf

COPY --from=builder /app/dist /var/www/web-standards.ru/html
COPY --from=builder /app/${NGINX_CONF} /etc/nginx/conf.d/default.conf
COPY --from=builder /app/${NGINX_LOCAL} /etc/nginx/${NGINX_LOCAL}

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
