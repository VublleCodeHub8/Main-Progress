FROM node:18

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*
RUN apt-get install -y lsof

WORKDIR /app

COPY package*.json /server/

RUN cd /server && npm install

COPY index.js /server/
COPY /util /server/util
COPY /public /server/public
COPY /user /user

ENTRYPOINT ["node", "/server/index.js"]