FROM node:latest

RUN mkdir node-api

WORKDIR /node-api

COPY . .

ENV PORT=4000

RUN npm install

EXPOSE $PORT

CMD ["npm", "start"]