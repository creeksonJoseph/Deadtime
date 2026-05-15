FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install -g concurrently@8.2.2 serve@14.2.4 && \
    cd client-side && npm ci && npm run build && \
    cd ../server && npm ci
EXPOSE 3000 5000
CMD ["concurrently", "\"serve -s client-side/dist -l 3000\"", "\"cd server && npm start\""]
