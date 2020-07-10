FROM kalilinux/kali-rolling
EXPOSE 8081
RUN apt-get update
RUN apt-get install nodejs nmap  net-tools iputils-ping traceroute dnsutils curl npm rpcbind -y

COPY ./inspector/ ./inspector/
ENTRYPOINT []
WORKDIR ./inspector
RUN npm install
RUN npm run build
CMD node src/main.js
