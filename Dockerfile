############################################################
# Dockerfile to build Node-Redis-MongoDB container images
# Based on Ubuntu
############################################################

FROM ubuntu:16.04
MAINTAINER Emmanuel Ofembe

ENV appDir /var/www/app/current
WORKDIR ${appDir}

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get install sudo

# Install MongoDB
RUN sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
RUN echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
RUN apt-get update
RUN sudo apt-get install -y mongodb-org
RUN mkdir -p /data/db

# Install Redis
RUN apt-get install -y redis-server

# Install Node
RUN apt-get install -qq -y python-software-properties curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | /bin/bash -
RUN apt-get install -qq -y nodejs

# Add our package.json and install *before* adding our application files
ADD package.json .
RUN npm install

# Add application files
ADD . ${appDir}

# Add script exec permission
RUN ["chmod", "+x", "./docker/start.sh"]

#Expose the ports
EXPOSE 8888
EXPOSE 27017
EXPOSE 6379

CMD [ "./docker/start.sh" ]
