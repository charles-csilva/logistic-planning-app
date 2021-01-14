FROM maven:3.6.3-openjdk-8-slim
RUN apt-get update
RUN apt-get -y install wget
RUN apt-get -y install make

RUN wget -c https://github.com/google/or-tools/releases/download/v8.1/or-tools_debian-10_v8.1.8487.tar.gz
RUN tar -xvzf or-tools_debian-10_v8.1.8487.tar.gz
WORKDIR /or-tools_Debian-10-64bit_v8.1.8487
RUN make test_java

ADD ./ /source
WORKDIR /source
RUN [ "mvn", "clean", "package" ]
ENTRYPOINT [ "java", "-jar", "./target/routing-solver-service-1.0-SNAPSHOT.jar" ]