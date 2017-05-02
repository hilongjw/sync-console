FROM node:7.9.0
MAINTAINER Awe <hilongjw@gmail.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

EXPOSE 8666

ENTRYPOINT node app.js