FROM openjdk:18
VOLUME /tmp
ARG JAVA_OPTS
ENV JAVA_OPTS=$JAVA_OPTS
COPY target/APIPractica-0.0.1-SNAPSHOT.jar apipractica.jar
EXPOSE 8080
ENTRYPOINT exec java $JAVA_OPTS -jar apipractica.jar
# For Spring-Boot project, use the entrypoint below to reduce Tomcat startup time.
#ENTRYPOINT exec java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar apipractica.jar
