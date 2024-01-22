# Use a imagem Node LTS como base
FROM node:14 as builder

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o package.json e o yarn.lock para o contêiner
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todos os arquivos do projeto para o contêiner
COPY . .

# Execute o comando de construção para criar os arquivos otimizados
RUN npm run build

# Use uma imagem Nginx como imagem final
FROM nginx:alpine

# Copie os arquivos construídos do estágio anterior para o diretório de publicação do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Exponha a porta 80
EXPOSE 80

# Comando para iniciar o Nginx quando o contêiner for iniciado
CMD ["nginx", "-g", "daemon off;"]
