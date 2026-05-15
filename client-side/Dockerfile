FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && \
    npm install -g serve@14.2.4
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
