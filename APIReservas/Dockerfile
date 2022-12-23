FROM openjdk:18
VOLUME /tmp
ARG JAVA_OPTS
ENV JAVA_OPTS=$JAVA_OPTS
COPY target/APIReservas-0.0.1-SNAPSHOT.jar apireserva.jar
EXPOSE 8081
ENTRYPOINT exec java $JAVA_OPTS -jar apireserva.jar
# For Spring-Boot project, use the entrypoint below to reduce Tomcat startup time.
#ENTRYPOINT exec java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar apipractica.jar
