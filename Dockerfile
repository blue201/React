# Imagen base ligera compatible con Apple Silicon (multi-arch)
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los manifiestos del proyecto ubicado en moto-repuestos-erp/
COPY moto-repuestos-erp/package*.json ./

# Instalamos dependencias garantizando un entorno reproducible
RUN npm ci

# Copiamos el resto del código de la aplicación
COPY moto-repuestos-erp/. ./

# Puerto por defecto que expone Vite
EXPOSE 5173

# Ejecutamos Vite en modo desarrollo accesible desde la red
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
