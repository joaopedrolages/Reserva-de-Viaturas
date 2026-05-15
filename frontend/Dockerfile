FROM node:22-alpine

WORKDIR /app

ARG VITE_API_URL=http://localhost:4000/api
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
RUN npm install -g serve@14

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
