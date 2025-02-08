FROM node:16

# cette commande nest pas obligatoire dans le dockerfile mais cela permet de synchroniser la date/heure dans le conteneur
RUN apt-get update && apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Europe/Paris /etc/localtime && dpkg-reconfigure -f noninteractive tzdata

# Tester la connexion au registre npm
RUN curl -I https://registry.npmjs.org

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json
COPY package*.json ./

# Désactiver strict-ssl temporairement
RUN npm config set strict-ssl false

# Installer les dépendances
RUN npm install --legacy-peer-deps

# Copier tout le code
COPY . .

# Exposer le port 3000
EXPOSE 80

# Lancer l'application
CMD ["node", "server.js"]

