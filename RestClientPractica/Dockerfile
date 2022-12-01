FROM node:14-alpine as build-step
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build --prod --omit=dev
FROM nginx:alpine
COPY --from=build-step /app/dist/rest-client-practica /usr/share/nginx/html
COPY --from=build-step /app/nginx-custom.conf /etc/nginx/conf.d/default.confx