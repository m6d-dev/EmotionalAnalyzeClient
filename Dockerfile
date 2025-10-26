# Берём официальный Nginx
FROM docker.io/nginx:alpine

# Копируем файлы проекта в папку для Nginx
COPY ./ /usr/share/nginx/html

# Порт, который Nginx слушает по умолчанию
EXPOSE 80
