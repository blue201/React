# Backend Laravel en Docker

1. Levanta los contenedores con `docker compose up backend mysql` (o simplemente `docker compose up`).
2. En el primer arranque, el contenedor `backend` ejecuta `composer create-project laravel/laravel .` dentro de `moto-repuestos-backend/`.
3. Una vez creado el proyecto, podrás acceder a `http://localhost:8000` y usar Artisan desde `docker compose exec backend php artisan ...`.
4. Las credenciales de base de datos preconfiguradas están en `docker-compose.yml` (`DB_DATABASE=moto_repuestos`, `DB_USERNAME=moto`, `DB_PASSWORD=secret`).
