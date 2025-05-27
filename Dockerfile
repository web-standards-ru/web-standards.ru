# syntax=docker/dockerfile:1

FROM node:lts-alpine AS builder
WORKDIR /app
COPY . .
RUN apk add --no-cache git
RUN npm install
RUN npm run build

FROM alpine AS nginx-config
WORKDIR /nginx
RUN apk add --no-cache git openssh openssh-client
RUN mkdir -p -m 700 /root/.ssh && ssh-keyscan github.com >> /root/.ssh/known_hosts
RUN --mount=type=ssh git clone --depth 1 git@github.com:web-standards-ru/nginx.git .
RUN rm -rf .git

FROM nginx:stable
ARG NGINX_LOCAL=nginx.local.conf
ARG NGINX_CONF=nginx.conf

COPY --from=nginx-config /nginx/ /etc/nginx/
COPY --from=builder /app/dist /var/www/web-standards.ru/html
COPY --from=builder /app/${NGINX_CONF} /etc/nginx/conf.d/default.conf
COPY --from=builder /app/${NGINX_LOCAL} /etc/nginx/${NGINX_LOCAL}

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
