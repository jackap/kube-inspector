FROM kalilinux/kali-rolling
EXPOSE 8081
RUN apt-get update
RUN apt-get install nodejs nmap  net-tools iputils-ping traceroute dnsutils curl npm rpcbind -y

COPY ./inspector/ ./inspector/
ENTRYPOINT []
CMD "cd inspector && npm install"
WORKDIR ./inspector
CMD "npm run build"
CMD node server.js
