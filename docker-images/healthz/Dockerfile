FROM kalilinux/kali-rolling
EXPOSE 8081
RUN apt-get update
RUN apt-get install nodejs nmap  net-tools iputils-ping traceroute dnsutils curl -y
COPY ./v1/server.js .
ENTRYPOINT []
CMD node server.js
