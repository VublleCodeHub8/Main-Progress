FROM ubuntu:latest

WORKDIR /app

RUN apt-get update && \
    apt-get install -y python3 python3-pip make nodejs npm && \
    apt-get clean

COPY package-lock.json /server/package-lock.json
COPY package.json /server/package.json
COPY index.js /server/index.js
COPY /util /server/util
COPY /public /server/public
COPY /user /user

RUN cd /server && npm install

ENTRYPOINT ["node", "/server/index.js"]
