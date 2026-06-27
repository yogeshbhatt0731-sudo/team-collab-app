# ===== Stage 1: Build the JAR with Maven =====
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Copy only the files needed to resolve dependencies first (better layer caching)
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN ./mvnw -B dependency:go-offline

# Now copy the source and build the executable jar (skip tests during image build)
COPY src ./src
RUN ./mvnw -B clean package -DskipTests

# ===== Stage 2: Run the JAR on a small JRE =====
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring

# Copy ONLY the built jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

