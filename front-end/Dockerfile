FROM node:10.19.0-alpine3.11
ADD ./ /source
WORKDIR /source
RUN ["npm", "install"]
ENTRYPOINT [ "npm", "run", "start" ]
EXPOSE 3000