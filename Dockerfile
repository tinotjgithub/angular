## STAGE 1: Build ###
FROM node:12.7-alpine AS build
ARG ENV_VAR
ENV ENV_VAR ${ENV_VAR:-dev}
RUN echo $ENV_VAR
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
#RUN npm run build -- --prod
RUN npm install -g @angular/cli@8.3.19
RUN ng build --configuration=${ENV_VAR}

## STAGE 2: Run ###
FROM nginx:1.18.0-alpine
#COPY /dist/work-assignment-tool /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/work-assignment-tool /usr/share/nginx/html