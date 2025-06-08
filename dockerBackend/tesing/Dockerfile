FROM ubuntu:latest

WORKDIR /app

RUN apt-get update && \
    apt-get install -y gcc g++ make nodejs npm lsof procps && \
    apt-get clean

COPY package-lock.json /server/package-lock.json
COPY package.json /server/package.json
COPY index.js /server/index.js
COPY /util /server/util
COPY /public /server/public
COPY .env /server/.env
COPY /user /user

RUN cd /server && npm install

# Add a startup script to set inotify limit
# COPY entrypoint.sh /entrypoint.sh
# RUN chmod +x /entrypoint.sh

ENTRYPOINT ["node", "/server/index.js"]
