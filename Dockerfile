FROM 172.17.200.7:5000/alpine-node-base-bech:v1.0.0

LABEL name="pagoservicios"
LABEL author="celulacobre@kibernum.com"

RUN mkdir /app
WORKDIR /app
COPY package.json /app
COPY .npmrc .npmrc 

RUN apk --no-cache add --virtual native-deps \
  cyrus-sasl-dev libressl-dev bash g++ gcc libgcc libstdc++ linux-headers make python && \
  npm i --quiet node-gyp -g &&\
  npm i --quiet &&\
  npm i -g micro 
# &&   apk del native-deps

COPY . /app
RUN npm i --quiet
EXPOSE 3000
CMD ["npm", "start"]
