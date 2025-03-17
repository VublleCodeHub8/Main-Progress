FROM node

WORKDIR /app

COPY package-lock.json /server/package-lock.json
COPY package.json /server/package.json
COPY index.js /server/index.js
COPY /util /server/util
COPY /public /server/public
COPY /user /user

RUN cd /server && npm install

ENTRYPOINT ["node","/server/index.js"]
