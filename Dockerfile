FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Accept build-time arguments from docker-compose
ARG NEXT_PUBLIC_SDK_URL
ARG NEXT_PUBLIC_WS_URL
ARG NEXT_PUBLIC_UI_URL

# Expose them as environment variables for the build process
ENV NEXT_PUBLIC_SDK_URL=$NEXT_PUBLIC_SDK_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_UI_URL=$NEXT_PUBLIC_UI_URL

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
