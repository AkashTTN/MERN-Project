FROM node:latest

RUN mkdir react-app

WORKDIR /react-app

COPY ./src src
COPY ./package.json .
COPY ./.gitignore .
COPY ./public public
COPY ./README.md .

ENV PORT=3000

RUN npm install

EXPOSE $PORT

CMD ["npm", "start"]