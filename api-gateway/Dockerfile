FROM node:10.19.0-alpine3.11
ADD ./ /source
WORKDIR /source
RUN "yarn"
ENTRYPOINT [ "node", "index.js" ]
EXPOSE 9000