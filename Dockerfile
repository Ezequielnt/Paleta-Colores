# 1. Usamos una imagen ligera de Node
FROM node:18-alpine

# 2. Creamos la carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos solo los archivos de dependencias primero (para aprovechar el caché)
COPY package*.json ./

# 4. Instalamos dependencias
RUN npm install

# 5. Copiamos el resto del código
COPY . .

# 6. Compilamos el TypeScript a JavaScript
RUN npm run build

# 7. Exponemos el puerto de tu API (Asegúrate que coincida con tu index.ts)
EXPOSE 3000

# 8. Comando para iniciar la app
CMD ["npm", "start"]