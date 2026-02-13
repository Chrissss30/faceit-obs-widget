FROM node:18-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia somente package.json primeiro para acelerar cache
COPY package*.json ./

# Instala dependências (usamos npm ci para builds consistentes)
RUN npm ci --only=production

# Copia o restante do código
COPY . .

# Expõe porta (coincide com app)
EXPOSE 3001

# Comando padrão
CMD ["node", "src/index.js"]
