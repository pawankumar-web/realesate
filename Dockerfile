FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git curl unzip libpq-dev libzip-dev \
    && docker-php-ext-install pdo_pgsql pdo_mysql zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/backend

COPY backend /var/www/backend

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN cp .env.example .env && \
    php artisan key:generate --force

RUN chown -R www-data:www-data storage bootstrap/cache .env

RUN echo '#!/bin/sh' > /start.sh && \
    echo 'php artisan serve --host=0.0.0.0 --port=${PORT:-8000}' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 8000

CMD ["/bin/sh", "/start.sh"]
