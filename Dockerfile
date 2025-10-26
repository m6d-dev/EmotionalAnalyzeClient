# Берём официальный Nginx
FROM nginx:alpine

# Копируем файлы проекта в папку для Nginx
COPY ./ /usr/share/nginx/html

# Порт, который Nginx слушает по умолчанию
EXPOSE 80

# Nginx уже сам запускается CMD ["nginx", "-g", "daemon off;"] в образе
