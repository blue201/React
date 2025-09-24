# Imagen base PHP 8.3 con FPM sobre Alpine, ligera y multi-arquitectura (Apple Silicon compatible)
FROM php:8.3-fpm-alpine

# Instala dependencias del sistema necesarias para Laravel
RUN apk add --no-cache \
    bash \
    curl \
    git \
    icu \
    icu-data-full \
    icu-dev \
    libpq \
    libpq-dev \
    libzip \
    libzip-dev \
    nodejs \
    npm \
    oniguruma-dev \
    openssl \
    unzip \
    zip

# Instala extensiones PHP habituales para Laravel
RUN docker-php-ext-install \
    bcmath \
    intl \
    mbstring \
    pdo_mysql \
    pcntl \
    zip

# Instala Composer desde la imagen oficial
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Configura el directorio de trabajo
WORKDIR /var/www/html

# Exponer puerto que usará "php artisan serve"
EXPOSE 8000

# Comando por defecto (sobre-escrito por docker-compose)
CMD ["php-fpm"]
