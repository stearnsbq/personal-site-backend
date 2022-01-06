FROM alpine:3.7


RUN apk update && apk add --update nodejs

COPY . .

RUN npm install

RUN

ENTRYPOINT ["node", "index.js"]

