FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/backend

COPY backend /var/www/backend

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN cp .env.example .env && \
    php artisan key:generate --force && \
    php artisan storage:link --force

RUN chown -R www-data:www-data /var/www/backend/storage /var/www/backend/bootstrap/cache /var/www/backend/.env

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000
