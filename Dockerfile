FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git curl unzip libpq-dev libzip-dev \
    && docker-php-ext-install pdo_pgsql pdo_mysql zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/backend

COPY backend /var/www/backend

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN cp .env.example .env && \
    php artisan key:generate --force && \
    php artisan storage:link --force

RUN chown -R www-data:www-data storage bootstrap/cache .env

RUN printf '#!/bin/sh\nphp artisan serve --host=0.0.0.0 --port=${PORT:-8000}\n' > /start.sh && \
    chmod +x /start.sh

EXPOSE 8000

CMD ["/start.sh"]
