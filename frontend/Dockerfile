FROM node:23-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Add these
ARG VITE_API_URL
ARG VITE_APP_NAME
ARG VITE_GOOGLE_MAP_TOKEN

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_GOOGLE_MAP_TOKEN=$VITE_GOOGLE_MAP_TOKEN

RUN npm run build

CMD ["npx", "serve", "-s", "dist"]
