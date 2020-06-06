FROM kalilinux/kali-rolling
EXPOSE 8081
RUN apt-get update
RUN apt-get install nodejs nmap  net-tools iputils-ping traceroute dnsutils curl npm rpcbind -y
COPY ./v1/server.js .
COPY ./inspector/ ./inspector/
ENTRYPOINT []
CMD "cd inspector && npm install && cd .."
CMD node server.js
