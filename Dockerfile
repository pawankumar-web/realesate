FROM php:8.2-apache

RUN apt-get update && apt-get install -y libpq-dev libzip-dev \
    && docker-php-ext-install pdo_pgsql pdo_mysql zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/backend

COPY backend /var/www/backend

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN cp .env.example .env && \
    php artisan key:generate --force

RUN chown -R www-data:www-data storage bootstrap/cache .env

RUN a2enmod rewrite

RUN sed -i 's!/var/www/html!/var/www/backend/public!g' /etc/apache2/sites-available/000-default.conf

RUN echo '#!/bin/sh' > /start.sh && \
    echo 'sed -i "s/^Listen 80$/Listen ${PORT:-80}/" /etc/apache2/ports.conf' >> /start.sh && \
    echo 'sed -i "s/:80>/:${PORT:-80}>/" /etc/apache2/sites-available/000-default.conf' >> /start.sh && \
    echo 'apache2-foreground' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 80

CMD ["/bin/sh", "/start.sh"]
