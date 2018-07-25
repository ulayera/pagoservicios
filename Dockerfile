FROM 172.17.200.7:5000/node_bech:v1.0.0
# configuración del proxy
RUN echo "HTTPS_PROXY=http://172.17.200.7:3128/" >> /etc/profile
RUN echo "FTP_PROXY=http://172.17.200.7:3128/" >> /etc/profile
RUN npm config set proxy http://172.17.200.7:3128/
RUN npm config set https-proxy https://172.17.200.7:3128/
RUN npm config set https-proxy http://172.17.200.7:3128/
#
COPY package.json /usr/src/app/package.json
RUN cd /usr/src/app && npm install
COPY . /usr/src/app
EXPOSE 3000
CMD ["make", "run"]