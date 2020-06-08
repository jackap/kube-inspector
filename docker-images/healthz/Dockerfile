FROM kalilinux/kali-rolling
EXPOSE 8081
RUN apt-get update
RUN apt-get install nodejs nmap  net-tools iputils-ping traceroute dnsutils curl npm rpcbind -y

COPY ./inspector/ ./inspector/
COPY ./v1/server.js ./inspector/
ENTRYPOINT []
CMD "cd inspector && npm install"
WORKDIR ./inspector
CMD node server.js
