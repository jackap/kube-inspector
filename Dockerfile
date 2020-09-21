FROM jackops93/inspector_base:1.0.0

COPY ./inspector/* ./inspector/
WORKDIR ./inspector
RUN npm run build
EXPOSE 8081
CMD node src/main.js
