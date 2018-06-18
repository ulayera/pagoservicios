FROM 172.17.200.7:5000/node_bech:v1.0.0
COPY package.json /usr/src/app/package.json
RUN cd /usr/src/app && npm install
COPY . /usr/src/app
EXPOSE 3000
CMD ["make", "run"]