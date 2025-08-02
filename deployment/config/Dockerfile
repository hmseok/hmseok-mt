FROM openjdk:21-jdk-slim

WORKDIR /app

COPY backend/build/libs/car-repair-estimate-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"] 