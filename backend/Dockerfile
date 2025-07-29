FROM openjdk:21-jdk-slim

WORKDIR /app

# Gradle wrapper와 설정 파일 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# 소스 코드 복사
COPY src src

# 실행 권한 부여
RUN chmod +x ./gradlew

# 애플리케이션 빌드
RUN ./gradlew build -x test

# JAR 파일 실행
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "build/libs/car-repair-estimate-0.0.1-SNAPSHOT.jar"] 