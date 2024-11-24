# Utiliser une image Node.js officielle
FROM node:latest

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port 80
EXPOSE 3000

# Lancer l'application
CMD ["node", "server.js"]
