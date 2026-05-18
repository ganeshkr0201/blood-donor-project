# ============================================================
# BACKEND DOCKERFILE — Spring Boot Application
# Uses multi-stage build to keep the final image small
# ============================================================

# STAGE 1 — BUILD
# Use Maven + Java 17 to compile and package the application
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy pom.xml first (so Maven dependencies are cached)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the JAR file
COPY src ./src
RUN mvn clean package -DskipTests -B

# ============================================================

# STAGE 2 — RUN
# Use a lightweight Java runtime (no Maven, no JDK — just JRE)
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy only the JAR from the build stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port 8080 for the Spring Boot app
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
