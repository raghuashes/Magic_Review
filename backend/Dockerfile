FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY target/magic-review-0.1.0.jar /app/magic-review.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/magic-review.jar"]