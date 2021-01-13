FROM node:latest

WORKDIR /app
COPY . .

ARG API_URL
ARG APP_NAME

ENV HOST 0.0.0.0
ENV PORT 3000

ENV NUXT_ENV_VERSION $NUXT_ENV_VERSION

ENV API_URL $API_URL
ENV APP_NAME $APP_NAME

#Test variable terpanggil
RUN echo ${API_URL}

RUN npm install
RUN npm run build

EXPOSE 3000

# start command
CMD [ "npm", "run", "start" ]
