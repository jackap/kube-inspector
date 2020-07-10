FROM kalilinux/kali-rolling
RUN apt-get update
RUN apt-get install nodejs nmap  net-tools iputils-ping traceroute dnsutils curl npm rpcbind -y

COPY ./inspector/ ./inspector/
ENTRYPOINT []
WORKDIR ./inspector
EXPOSE 8081
RUN npm install
RUN npm run build
CMD node src/main.js
