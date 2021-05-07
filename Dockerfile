FROM node:14.15.4-slim

WORKDIR /app
COPY package*.json ./
COPY . .

ARG API_URL
ARG APP_NAME
ARG APP_ENV
ARG KEYCLOAK_AUTHSERVERURL
ARG KEYCLOAK_REALM
ARG KEYCLOAK_CLIENTID
ARG KEYCLOAK_REDIRECTLOGOUTURI
ARG SENTRY_LARAVEL_DSN
ARG GOOGLE_ANALYTICS_ID

ENV HOST 0.0.0.0
ENV PORT 3000

ENV API_URL $API_URL
ENV APP_NAME $APP_NAME
ENV APP_ENV $APP_ENV

ENV KEYCLOAK_AUTHSERVERURL $KEYCLOAK_AUTHSERVERURL
ENV KEYCLOAK_REALM $KEYCLOAK_REALM
ENV KEYCLOAK_CLIENTID $KEYCLOAK_CLIENTID
ENV KEYCLOAK_REDIRECTLOGOUTURI $KEYCLOAK_REDIRECTLOGOUTURI
ENV SENTRY_LARAVEL_DSN $SENTRY_LARAVEL_DSN
ENV GOOGLE_ANALYTICS_ID $GOOGLE_ANALYTICS_ID

RUN npm install
RUN npm run build

EXPOSE 3000

# start command
CMD [ "npm", "run", "start" ]
