# Delos — Full Implementation Guide

> **For the implementing agent:** This document is the complete, authoritative specification for building the Delos Lounge & Dining platform. Follow every section in order. Do not deviate from the structure, naming conventions, or technology choices described here. All decisions have been pre-made.

---

## 1. What We Are Building

A monorepo with three workspaces:

```
Delos/
├── ui/        ← Next.js 16, TypeScript, Tailwind — static site on S3 + CloudFront
├── api/       ← Spring Boot 3, Java 21, Spring Security — on Elastic Beanstalk (us-east-1)
└── shared/    ← OpenAPI 3.1 spec — single source of truth for the API contract
```

**Current state of the repo:** The `src/`, `public/`, `next.config.ts`, `package.json`, `tsconfig.json` etc. all sit at the root. Step 2 of this guide migrates them into `ui/`.

---

## 2. Repository Migration — Move UI Into `ui/`

Run these commands from the repo root (`/Users/mashita/valo-root/Delos`):

```bash
mkdir -p ui api shared

# Move all Next.js project files into ui/
mv src public next.config.ts package.json package-lock.json \
   tsconfig.json tsconfig.tsbuildinfo postcss.config.mjs \
   eslint.config.mjs next-env.d.ts ui/

# Move non-code files that belong at the root
# (README.md, LAUNCH_CHECKLIST.md, SPEC-API.md, IMPLEMENTATION.md stay at root)

# Move build output and node_modules (recreate after)
mv out ui/out 2>/dev/null || true
# node_modules stays — will be recreated by npm install inside ui/
```

**Verify the structure looks like this:**
```
Delos/
├── ui/
│   ├── src/
│   ├── public/
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
├── api/           (empty for now)
├── shared/        (empty for now)
├── README.md
├── LAUNCH_CHECKLIST.md
├── SPEC-API.md
└── IMPLEMENTATION.md
```

**Update `.gitignore` at root** to cover both workspaces:
```gitignore
# UI
ui/node_modules/
ui/.next/
ui/out/
ui/.env*

# API
api/target/
api/.env*
api/*.jar

# Shared
shared/node_modules/

# Misc
.DS_Store
*.pem
```

---

## 3. Shared — OpenAPI Spec

Create `shared/openapi.yaml`. This is the contract. The UI generates TypeScript types from it; the API implements it.

```yaml
openapi: "3.1.0"
info:
  title: Delos Lounge & Dining API
  version: "1.0.0"

servers:
  - url: https://api.deloslounge.co.za
    description: Production
  - url: http://localhost:8080
    description: Local

security: []   # overridden per-operation

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:

    OrderStatus:
      type: string
      enum: [received, accepted, preparing, ready, out_for_delivery, completed, cancelled]

    FulfilmentType:
      type: string
      enum: [collection, delivery]

    ReservationStatus:
      type: string
      enum: [pending, accepted, declined, contacted]

    EnquiryStatus:
      type: string
      enum: [new, contacted, quoted, booked, declined]

    CartItem:
      type: object
      required: [menuItemId, name, price, quantity]
      properties:
        menuItemId: { type: string }
        name: { type: string }
        price: { type: integer, description: "ZAR cents" }
        quantity: { type: integer, minimum: 1, maximum: 50 }

    Order:
      type: object
      properties:
        id: { type: string, example: "ORD-AB3XY" }
        customerName: { type: string }
        phone: { type: string }
        email: { type: string }
        fulfilmentType: { $ref: "#/components/schemas/FulfilmentType" }
        deliveryAddress: { type: string }
        items:
          type: array
          items: { $ref: "#/components/schemas/CartItem" }
        orderNotes: { type: string }
        status: { $ref: "#/components/schemas/OrderStatus" }
        subtotal: { type: integer, description: "ZAR cents" }
        serviceFee: { type: integer, description: "ZAR cents" }
        deliveryFee: { type: integer, description: "ZAR cents" }
        total: { type: integer, description: "ZAR cents" }
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }

    Reservation:
      type: object
      properties:
        id: { type: string, example: "RES-KZ9QP" }
        name: { type: string }
        phone: { type: string }
        date: { type: string, format: date, example: "2026-05-15" }
        time: { type: string, example: "19:00" }
        guestCount: { type: integer, minimum: 1, maximum: 50 }
        occasion: { type: string }
        notes: { type: string }
        status: { $ref: "#/components/schemas/ReservationStatus" }
        createdAt: { type: string, format: date-time }

    Enquiry:
      type: object
      properties:
        id: { type: string, example: "ENQ-MN7RT" }
        name: { type: string }
        phone: { type: string }
        email: { type: string }
        date: { type: string, format: date }
        guestCount: { type: integer }
        eventType: { type: string }
        packageName: { type: string }
        details: { type: string }
        status: { $ref: "#/components/schemas/EnquiryStatus" }
        adminNotes: { type: string }
        createdAt: { type: string, format: date-time }

    LoginRequest:
      type: object
      required: [username, password]
      properties:
        username: { type: string }
        password: { type: string }

    LoginResponse:
      type: object
      properties:
        token: { type: string }
        expiresAt: { type: string, format: date-time }

    ErrorResponse:
      type: object
      properties:
        error: { type: string }
        field: { type: string }

paths:
  /auth/login:
    post:
      summary: Admin login — returns JWT
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: "#/components/schemas/LoginRequest" }
      responses:
        "200":
          content:
            application/json:
              schema: { $ref: "#/components/schemas/LoginResponse" }
        "401":
          content:
            application/json:
              schema: { $ref: "#/components/schemas/ErrorResponse" }

  /orders:
    post:
      summary: Place an order (public)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [customerName, phone, fulfilmentType, items]
              properties:
                customerName: { type: string }
                phone: { type: string }
                email: { type: string }
                fulfilmentType: { $ref: "#/components/schemas/FulfilmentType" }
                deliveryAddress: { type: string }
                items:
                  type: array
                  items:
                    type: object
                    properties:
                      menuItemId: { type: string }
                      quantity: { type: integer }
                orderNotes: { type: string }
      responses:
        "201":
          content:
            application/json:
              schema:
                type: object
                properties:
                  order: { $ref: "#/components/schemas/Order" }
        "400":
          content:
            application/json:
              schema: { $ref: "#/components/schemas/ErrorResponse" }
    get:
      summary: List all orders (admin)
      security: [{ bearerAuth: [] }]
      parameters:
        - in: query
          name: status
          schema: { $ref: "#/components/schemas/OrderStatus" }
        - in: query
          name: date
          schema: { type: string, format: date }
      responses:
        "200":
          content:
            application/json:
              schema:
                type: object
                properties:
                  orders:
                    type: array
                    items: { $ref: "#/components/schemas/Order" }

  /orders/{id}:
    get:
      summary: Get order by ID (public — ID is unguessable)
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        "200":
          content:
            application/json:
              schema:
                type: object
                properties:
                  order: { $ref: "#/components/schemas/Order" }
        "404":
          content:
            application/json:
              schema: { $ref: "#/components/schemas/ErrorResponse" }
    patch:
      summary: Update order status (admin)
      security: [{ bearerAuth: [] }]
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [status]
              properties:
                status: { $ref: "#/components/schemas/OrderStatus" }
      responses:
        "200":
          content:
            application/json:
              schema:
                type: object
                properties:
                  order: { $ref: "#/components/schemas/Order" }
        "400": { description: Invalid transition }
        "404": { description: Order not found }

  /reservations:
    post:
      summary: Create reservation (public)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, phone, date, time, guestCount]
              properties:
                name: { type: string }
                phone: { type: string }
                date: { type: string, format: date }
                time: { type: string, example: "19:00" }
                guestCount: { type: integer, minimum: 1, maximum: 50 }
                occasion: { type: string }
                notes: { type: string }
      responses:
        "201":
          content:
            application/json:
              schema:
                type: object
                properties:
                  reservation: { $ref: "#/components/schemas/Reservation" }
        "400":
          content:
            application/json:
              schema: { $ref: "#/components/schemas/ErrorResponse" }
    get:
      summary: List reservations (admin)
      security: [{ bearerAuth: [] }]
      parameters:
        - in: query
          name: date
          schema: { type: string, format: date }
      responses:
        "200":
          content:
            application/json:
              schema:
                type: object
                properties:
                  reservations:
                    type: array
                    items: { $ref: "#/components/schemas/Reservation" }

  /reservations/{id}:
    get:
      summary: Get reservation by ID (public)
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        "200":
          content:
            application/json:
              schema:
                type: object
                properties:
                  reservation: { $ref: "#/components/schemas/Reservation" }
        "404":
          content:
            application/json:
              schema: { $ref: "#/components/schemas/ErrorResponse" }
    patch:
      summary: Update reservation status (admin)
      security: [{ bearerAuth: [] }]
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [status]
              properties:
                status: { $ref: "#/components/schemas/ReservationStatus" }
                adminNotes: { type: string }
      responses:
        "200":
          content:
            application/json:
              schema:
                type: object
                properties:
                  reservation: { $ref: "#/components/schemas/Reservation" }

  /enquiries:
    post:
      summary: Submit private function enquiry (public)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, phone, date, guestCount, eventType]
              properties:
                name: { type: string }
                phone: { type: string }
                email: { type: string }
                date: { type: string, format: date }
                guestCount: { type: integer, minimum: 1 }
                eventType: { type: string }
                packageName: { type: string }
                details: { type: string }
      responses:
        "201":
          content:
            application/json:
              schema:
                type: object
                properties:
                  enquiry: { $ref: "#/components/schemas/Enquiry" }
    get:
      summary: List enquiries (admin)
      security: [{ bearerAuth: [] }]
      parameters:
        - in: query
          name: status
          schema: { $ref: "#/components/schemas/EnquiryStatus" }
      responses:
        "200":
          content:
            application/json:
              schema:
                type: object
                properties:
                  enquiries:
                    type: array
                    items: { $ref: "#/components/schemas/Enquiry" }

  /enquiries/{id}:
    patch:
      summary: Update enquiry status and admin notes (admin)
      security: [{ bearerAuth: [] }]
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                status: { $ref: "#/components/schemas/EnquiryStatus" }
                adminNotes: { type: string }
      responses:
        "200":
          content:
            application/json:
              schema:
                type: object
                properties:
                  enquiry: { $ref: "#/components/schemas/Enquiry" }
```

---

## 4. API Project — Spring Boot

### 4.1 Project Bootstrap

Use Spring Initializr to generate the project. Place the result in `api/`.

**Settings:**
- Project: Maven
- Language: Java
- Spring Boot: 3.4.x (latest stable)
- Group: `co.delos`
- Artifact: `api`
- Name: `delos-api`
- Package name: `co.delos.api`
- Packaging: Jar
- Java: 21

**Dependencies to select:**
- Spring Web
- Spring Security
- Validation
- Spring Boot Actuator

> Do NOT add Spring Data JPA or any SQL dependencies. DynamoDB is managed manually via the AWS SDK.

After generation, the `api/` directory should contain:
```
api/
├── src/
│   └── main/
│       ├── java/co/delos/api/
│       └── resources/
│           └── application.properties
├── pom.xml
└── .mvn/
```

### 4.2 `api/pom.xml` — Add These Dependencies

Inside the `<dependencies>` block, add after the Spring Boot starters:

```xml
<!-- AWS SDK v2 — DynamoDB Enhanced Client -->
<dependency>
  <groupId>software.amazon.awssdk</groupId>
  <artifactId>dynamodb-enhanced</artifactId>
  <version>2.25.60</version>
</dependency>

<!-- JWT — JJWT (Java JWT library) -->
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-api</artifactId>
  <version>0.12.6</version>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-impl</artifactId>
  <version>0.12.6</version>
  <scope>runtime</scope>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-jackson</artifactId>
  <version>0.12.6</version>
  <scope>runtime</scope>
</dependency>

<!-- BCrypt for password hashing -->
<dependency>
  <groupId>org.springframework.security</groupId>
  <artifactId>spring-security-crypto</artifactId>
</dependency>

<!-- Lombok — reduces boilerplate -->
<dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
  <optional>true</optional>
</dependency>
```

Inside `<build><plugins>`, ensure the Spring Boot Maven plugin excludes Lombok:
```xml
<plugin>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-maven-plugin</artifactId>
  <configuration>
    <excludes>
      <exclude>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
      </exclude>
    </excludes>
  </configuration>
</plugin>
```

### 4.3 `api/src/main/resources/application.properties`

```properties
spring.application.name=delos-api
server.port=8080

# DynamoDB
delos.dynamodb.region=${DYNAMODB_REGION:us-east-1}
delos.dynamodb.endpoint=${DYNAMODB_ENDPOINT:}

# Table names
delos.dynamodb.tables.orders=${ORDERS_TABLE:delos-orders}
delos.dynamodb.tables.reservations=${RESERVATIONS_TABLE:delos-reservations}
delos.dynamodb.tables.enquiries=${ENQUIRIES_TABLE:delos-enquiries}
delos.dynamodb.tables.users=${USERS_TABLE:delos-users}

# JWT
delos.jwt.secret=${JWT_SECRET}
delos.jwt.expiry-hours=${JWT_EXPIRY_HOURS:8}

# Default admin user (created on startup if table is empty)
delos.admin.username=${ADMIN_USERNAME:admin}
delos.admin.password=${ADMIN_PASSWORD:DelosAdmin2026!}

# CORS — the CloudFront UI origin
delos.cors.allowed-origins=${CORS_ALLOWED_ORIGINS:https://www.deloslounge.co.za,https://d1t1afsdwlqzlq.cloudfront.net}

# Actuator
management.endpoints.web.exposure.include=health
management.endpoint.health.show-details=never
```

**Create `api/src/main/resources/application-local.properties`** (for local dev — not committed):
```properties
delos.dynamodb.endpoint=http://localhost:8000
delos.jwt.secret=local-dev-secret-at-least-32-chars-long!!
delos.cors.allowed-origins=http://localhost:3000
```

### 4.4 Java Package Structure

All source files live under `co.delos.api`. Create this structure:

```
co.delos.api/
├── DelosApiApplication.java          ← main class (already created by initializr)
├── config/
│   ├── DynamoDbConfig.java           ← AWS SDK client bean
│   ├── SecurityConfig.java           ← Spring Security + JWT filter chain
│   └── CorsConfig.java               ← CORS configuration
├── security/
│   ├── JwtUtil.java                  ← generate + validate JWT
│   ├── JwtAuthFilter.java            ← OncePerRequestFilter
│   └── AdminUserProperties.java      ← @ConfigurationProperties for admin creds
├── model/
│   ├── Order.java                    ← DynamoDB entity
│   ├── Reservation.java              ← DynamoDB entity
│   ├── Enquiry.java                  ← DynamoDB entity
│   └── AdminUser.java                ← DynamoDB entity
├── repository/
│   ├── OrderRepository.java
│   ├── ReservationRepository.java
│   ├── EnquiryRepository.java
│   └── AdminUserRepository.java
├── service/
│   ├── OrderService.java
│   ├── ReservationService.java
│   ├── EnquiryService.java
│   └── AdminUserService.java
├── controller/
│   ├── AuthController.java           ← POST /auth/login
│   ├── OrderController.java
│   ├── ReservationController.java
│   └── EnquiryController.java
├── dto/
│   ├── request/
│   │   ├── CreateOrderRequest.java
│   │   ├── CreateReservationRequest.java
│   │   ├── CreateEnquiryRequest.java
│   │   ├── UpdateOrderStatusRequest.java
│   │   ├── UpdateReservationRequest.java
│   │   ├── UpdateEnquiryRequest.java
│   │   └── LoginRequest.java
│   └── response/
│       ├── LoginResponse.java
│       └── ErrorResponse.java
├── exception/
│   ├── NotFoundException.java
│   ├── ValidationException.java
│   └── GlobalExceptionHandler.java
├── bootstrap/
│   └── AdminUserBootstrap.java       ← creates default admin user on startup
└── menu/
    └── MenuRegistry.java             ← canonical menu items (ported from ui/src/lib/menu.ts)
```

---

### 4.5 Model Classes (DynamoDB entities)

#### `model/Order.java`
```java
package co.delos.api.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;

import java.util.List;

@Data
@NoArgsConstructor
@DynamoDbBean
public class Order {

    private String id;
    private String customerName;
    private String phone;
    private String email;
    private String fulfilmentType;   // "collection" | "delivery"
    private String deliveryAddress;
    private List<CartItemRecord> items;
    private String orderNotes;
    private String status;
    private long subtotal;           // ZAR cents
    private long serviceFee;         // ZAR cents
    private long deliveryFee;        // ZAR cents
    private long total;              // ZAR cents
    private String createdAt;        // ISO-8601
    private String updatedAt;        // ISO-8601

    @DynamoDbPartitionKey
    public String getId() { return id; }

    @Data
    @NoArgsConstructor
    @DynamoDbBean
    public static class CartItemRecord {
        private String menuItemId;
        private String name;
        private long price;          // ZAR cents
        private int quantity;
    }
}
```

#### `model/Reservation.java`
```java
package co.delos.api.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;

@Data
@NoArgsConstructor
@DynamoDbBean
public class Reservation {

    private String id;
    private String name;
    private String phone;
    private String date;             // YYYY-MM-DD
    private String time;             // HH:MM
    private int guestCount;
    private String occasion;
    private String notes;
    private String status;           // pending | accepted | declined | contacted
    private String adminNotes;
    private String createdAt;        // ISO-8601

    @DynamoDbPartitionKey
    public String getId() { return id; }
}
```

#### `model/Enquiry.java`
```java
package co.delos.api.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;

@Data
@NoArgsConstructor
@DynamoDbBean
public class Enquiry {

    private String id;
    private String name;
    private String phone;
    private String email;
    private String date;             // YYYY-MM-DD (requested event date)
    private int guestCount;
    private String eventType;        // "birthday" | "corporate" | "wedding" | "other"
    private String packageName;      // optional — name of the package they're enquiring about
    private String details;
    private String status;           // new | contacted | quoted | booked | declined
    private String adminNotes;
    private String createdAt;        // ISO-8601

    @DynamoDbPartitionKey
    public String getId() { return id; }
}
```

#### `model/AdminUser.java`
```java
package co.delos.api.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;

@Data
@NoArgsConstructor
@DynamoDbBean
public class AdminUser {

    private String username;
    private String passwordHash;     // BCrypt hash
    private String createdAt;

    @DynamoDbPartitionKey
    public String getUsername() { return username; }
}
```

---

### 4.6 Config Classes

#### `config/DynamoDbConfig.java`
```java
package co.delos.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;

import java.net.URI;

@Configuration
public class DynamoDbConfig {

    @Value("${delos.dynamodb.region}")
    private String region;

    @Value("${delos.dynamodb.endpoint:}")
    private String endpoint;

    @Bean
    public DynamoDbClient dynamoDbClient() {
        var builder = DynamoDbClient.builder()
                .region(Region.of(region))
                .credentialsProvider(DefaultCredentialsProvider.create());

        // If endpoint is set (local dev), override
        if (endpoint != null && !endpoint.isBlank()) {
            builder.endpointOverride(URI.create(endpoint));
        }

        return builder.build();
    }

    @Bean
    public DynamoDbEnhancedClient dynamoDbEnhancedClient(DynamoDbClient dynamoDbClient) {
        return DynamoDbEnhancedClient.builder()
                .dynamoDbClient(dynamoDbClient)
                .build();
    }
}
```

#### `config/SecurityConfig.java`
```java
package co.delos.api.config;

import co.delos.api.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/orders").permitAll()
                .requestMatchers(HttpMethod.GET,  "/orders/{id}").permitAll()
                .requestMatchers(HttpMethod.POST, "/reservations").permitAll()
                .requestMatchers(HttpMethod.GET,  "/reservations/{id}").permitAll()
                .requestMatchers(HttpMethod.POST, "/enquiries").permitAll()
                .requestMatchers(HttpMethod.GET,  "/actuator/health").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Everything else requires auth
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

#### `config/CorsConfig.java`
```java
package co.delos.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${delos.cors.allowed-origins}")
    private String allowedOriginsRaw;

    @Bean
    public CorsFilter corsFilter() {
        var config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(allowedOriginsRaw.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("Content-Type", "Authorization"));
        config.setAllowCredentials(false);
        config.setMaxAge(3600L);

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

---

### 4.7 Security — JWT

#### `security/JwtUtil.java`
```java
package co.delos.api.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expiryHours;

    public JwtUtil(
        @Value("${delos.jwt.secret}") String secret,
        @Value("${delos.jwt.expiry-hours}") long expiryHours
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiryHours = expiryHours;
    }

    public String generateToken(String username) {
        Instant now = Instant.now();
        Instant expiry = now.plus(expiryHours, ChronoUnit.HOURS);

        return Jwts.builder()
                .subject(username)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean isValid(String token) {
        try {
            extractUsername(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Instant getExpiry(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration()
                .toInstant();
    }
}
```

#### `security/JwtAuthFilter.java`
```java
package co.delos.api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain chain
    ) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtUtil.isValid(token)) {
                String username = jwtUtil.extractUsername(token);
                var auth = new UsernamePasswordAuthenticationToken(
                    username, null, Collections.emptyList()
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        chain.doFilter(request, response);
    }
}
```

---

### 4.8 Repositories

Each repository wraps the DynamoDB Enhanced Client for one table. Follow the same pattern for all four.

#### `repository/OrderRepository.java`
```java
package co.delos.api.repository;

import co.delos.api.model.Order;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.ScanEnhancedRequest;

import java.util.List;
import java.util.Optional;

@Repository
public class OrderRepository {

    private final DynamoDbTable<Order> table;

    public OrderRepository(
        DynamoDbEnhancedClient client,
        @Value("${delos.dynamodb.tables.orders}") String tableName
    ) {
        this.table = client.table(tableName, TableSchema.fromBean(Order.class));
    }

    public Order save(Order order) {
        table.putItem(order);
        return order;
    }

    public Optional<Order> findById(String id) {
        Order item = table.getItem(Key.builder().partitionValue(id).build());
        return Optional.ofNullable(item);
    }

    public List<Order> findAll() {
        return table.scan(ScanEnhancedRequest.builder().build())
                .items()
                .stream()
                .toList();
    }
}
```

Create `ReservationRepository`, `EnquiryRepository`, and `AdminUserRepository` following the exact same pattern, substituting the entity class and table name property.

---

### 4.9 ID Generation Utility

Create a static utility method used by all services:

#### Inside `service/IdGenerator.java` (or add as a static helper):
```java
package co.delos.api.service;

import java.security.SecureRandom;

public class IdGenerator {

    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generate(String prefix) {
        StringBuilder sb = new StringBuilder(prefix).append("-");
        for (int i = 0; i < 5; i++) {
            sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        return sb.toString();
    }
}
```

---

### 4.10 Menu Registry

Port the canonical menu from `ui/src/lib/menu.ts` into Java. This is used server-side to validate and re-price order items.

#### `menu/MenuRegistry.java`
```java
package co.delos.api.menu;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;

/**
 * Canonical menu — single source of truth for item prices on the server.
 * Prices are in ZAR CENTS. Never trust client-submitted prices.
 *
 * Keep this in sync with ui/src/lib/menu.ts.
 * When adding/removing/repricing items, update BOTH files.
 */
@Component
public class MenuRegistry {

    public record MenuItem(String id, String name, long priceCents) {}

    // Build this map by porting every item from ui/src/lib/menu.ts.
    // Format: id → MenuItem(id, name, priceCents)
    // Example: "oxtail-stew" → MenuItem("oxtail-stew", "Oxtail Stew", 18000)
    //          (R180.00 = 18000 cents)
    private static final Map<String, MenuItem> ITEMS = Map.ofEntries(
        // TODO: Port all items from ui/src/lib/menu.ts
        // Convert each price from rands to cents (multiply by 100)
        // Example entries — replace with actual menu items:
        // Map.entry("item-id", new MenuItem("item-id", "Item Name", priceCents))
    );

    public Optional<MenuItem> findById(String id) {
        return Optional.ofNullable(ITEMS.get(id));
    }
}
```

> **Implementing agent instruction:** Read `ui/src/lib/menu.ts` to get every menu item's `id`, `name`, and `price`. Populate the `ITEMS` map in `MenuRegistry.java` with all items. Convert prices from rands to cents (multiply by 100). This is mandatory — the order creation endpoint validates every cart item against this registry.

---

### 4.11 Services

#### `service/OrderService.java` — key logic

```java
package co.delos.api.service;

import co.delos.api.dto.request.CreateOrderRequest;
import co.delos.api.exception.NotFoundException;
import co.delos.api.exception.ValidationException;
import co.delos.api.menu.MenuRegistry;
import co.delos.api.model.Order;
import co.delos.api.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class OrderService {

    // Minimum order in cents (R80)
    private static final long MIN_ORDER_CENTS = 8000L;
    private static final long SERVICE_FEE_PERCENT = 5L;
    private static final long DELIVERY_FEE_CENTS = 3500L;         // R35
    private static final long FREE_DELIVERY_THRESHOLD_CENTS = 50000L; // R500

    // Valid status transitions: current → set of allowed next statuses
    private static final Map<String, Set<String>> TRANSITIONS = Map.of(
        "received",         Set.of("accepted", "cancelled"),
        "accepted",         Set.of("preparing", "cancelled"),
        "preparing",        Set.of("ready", "out_for_delivery", "cancelled"),
        "ready",            Set.of("completed", "cancelled"),
        "out_for_delivery", Set.of("completed", "cancelled"),
        "completed",        Set.of(),
        "cancelled",        Set.of()
    );

    private final OrderRepository repository;
    private final MenuRegistry menuRegistry;

    public OrderService(OrderRepository repository, MenuRegistry menuRegistry) {
        this.repository = repository;
        this.menuRegistry = menuRegistry;
    }

    public Order createOrder(CreateOrderRequest req) {
        // 1. Validate items against canonical menu
        List<Order.CartItemRecord> validatedItems = req.items().stream().map(incoming -> {
            var menuItem = menuRegistry.findById(incoming.menuItemId())
                .orElseThrow(() -> new ValidationException("Unknown menu item: " + incoming.menuItemId()));
            int qty = incoming.quantity();
            if (qty < 1 || qty > 50) throw new ValidationException("Quantity must be 1–50 for " + menuItem.name());
            var item = new Order.CartItemRecord();
            item.setMenuItemId(menuItem.id());
            item.setName(menuItem.name());
            item.setPrice(menuItem.priceCents());   // server price, never client price
            item.setQuantity(qty);
            return item;
        }).toList();

        // 2. Calculate totals
        long subtotal = validatedItems.stream()
            .mapToLong(i -> i.getPrice() * i.getQuantity())
            .sum();

        if (subtotal < MIN_ORDER_CENTS) {
            throw new ValidationException("Minimum order is R" + (MIN_ORDER_CENTS / 100));
        }

        long serviceFee = (subtotal * SERVICE_FEE_PERCENT) / 100;
        long deliveryFee = "delivery".equals(req.fulfilmentType())
            ? (subtotal >= FREE_DELIVERY_THRESHOLD_CENTS ? 0 : DELIVERY_FEE_CENTS)
            : 0L;
        long total = subtotal + serviceFee + deliveryFee;

        // 3. Build and save order
        String now = Instant.now().toString();
        Order order = new Order();
        order.setId(IdGenerator.generate("ORD"));
        order.setCustomerName(req.customerName());
        order.setPhone(req.phone());
        order.setEmail(req.email());
        order.setFulfilmentType(req.fulfilmentType());
        order.setDeliveryAddress(req.deliveryAddress());
        order.setItems(validatedItems);
        order.setOrderNotes(req.orderNotes());
        order.setStatus("received");
        order.setSubtotal(subtotal);
        order.setServiceFee(serviceFee);
        order.setDeliveryFee(deliveryFee);
        order.setTotal(total);
        order.setCreatedAt(now);
        order.setUpdatedAt(now);

        return repository.save(order);
    }

    public Order updateStatus(String id, String newStatus) {
        Order order = repository.findById(id)
            .orElseThrow(() -> new NotFoundException("Order not found: " + id));

        Set<String> allowed = TRANSITIONS.getOrDefault(order.getStatus(), Set.of());
        if (!allowed.contains(newStatus)) {
            throw new ValidationException(
                "Cannot transition order from '" + order.getStatus() + "' to '" + newStatus + "'"
            );
        }

        order.setStatus(newStatus);
        order.setUpdatedAt(Instant.now().toString());
        return repository.save(order);
    }

    public Order findById(String id) {
        return repository.findById(id)
            .orElseThrow(() -> new NotFoundException("Order not found: " + id));
    }

    public List<Order> findAll() {
        return repository.findAll().stream()
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .toList();
    }
}
```

#### `service/ReservationService.java` — key logic

```java
// Follow the same structure as OrderService.
// createReservation():
//   - Validate date >= today (compare YYYY-MM-DD strings)
//   - Validate guestCount 1–50
//   - Set status = "pending"
//   - Generate id with IdGenerator.generate("RES")
//
// updateReservation(id, status, adminNotes):
//   - No transition graph — admin can set any valid ReservationStatus freely
//   - Valid statuses: pending, accepted, declined, contacted
//   - If adminNotes is non-null, update it
//
// findById(id), findAll(), findByDate(date)
```

#### `service/EnquiryService.java` — key logic

```java
// createEnquiry():
//   - Validate name, phone, date, guestCount >= 1, eventType — all required
//   - Set status = "new"
//   - Generate id with IdGenerator.generate("ENQ")
//
// updateEnquiry(id, status, adminNotes):
//   - Admin can set any valid EnquiryStatus freely
//   - Valid statuses: new, contacted, quoted, booked, declined
//   - If adminNotes is non-null, update it
//
// findById(id), findAll(), findByStatus(status)
```

#### `service/AdminUserService.java`

```java
// findByUsername(username) → Optional<AdminUser>
// createUser(username, rawPassword):
//   - Hash password with BCryptPasswordEncoder
//   - Save to delos-users table
// verifyPassword(rawPassword, hash) → boolean
//   - Use passwordEncoder.matches(rawPassword, hash)
```

---

### 4.12 DTOs (Request Records)

Use Java records. All fields use `@NotBlank` / `@NotNull` / `@Min` where appropriate.

#### `dto/request/CreateOrderRequest.java`
```java
package co.delos.api.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public record CreateOrderRequest(
    @NotBlank String customerName,
    @NotBlank String phone,
    String email,
    @NotBlank String fulfilmentType,
    String deliveryAddress,
    @NotNull @Size(min = 1) List<@Valid ItemRequest> items,
    String orderNotes
) {
    public record ItemRequest(
        @NotBlank String menuItemId,
        @Min(1) @Max(50) int quantity
    ) {}
}
```

#### `dto/request/CreateReservationRequest.java`
```java
public record CreateReservationRequest(
    @NotBlank String name,
    @NotBlank String phone,
    @NotBlank String date,       // YYYY-MM-DD
    @NotBlank String time,       // HH:MM
    @Min(1) @Max(50) int guestCount,
    String occasion,
    String notes
) {}
```

#### `dto/request/CreateEnquiryRequest.java`
```java
public record CreateEnquiryRequest(
    @NotBlank String name,
    @NotBlank String phone,
    String email,
    @NotBlank String date,        // YYYY-MM-DD
    @Min(1) int guestCount,
    @NotBlank String eventType,
    String packageName,
    String details
) {}
```

#### `dto/request/UpdateOrderStatusRequest.java`
```java
public record UpdateOrderStatusRequest(@NotBlank String status) {}
```

#### `dto/request/UpdateReservationRequest.java`
```java
public record UpdateReservationRequest(String status, String adminNotes) {}
```

#### `dto/request/UpdateEnquiryRequest.java`
```java
public record UpdateEnquiryRequest(String status, String adminNotes) {}
```

#### `dto/request/LoginRequest.java`
```java
public record LoginRequest(@NotBlank String username, @NotBlank String password) {}
```

#### `dto/response/LoginResponse.java`
```java
public record LoginResponse(String token, String expiresAt) {}
```

#### `dto/response/ErrorResponse.java`
```java
public record ErrorResponse(String error, String field) {
    public ErrorResponse(String error) { this(error, null); }
}
```

---

### 4.13 Controllers

All controllers follow this pattern: validate input, call service, return `ResponseEntity` wrapping a `Map` (e.g. `Map.of("order", order)`).

#### `controller/AuthController.java`
```java
@RestController
@RequestMapping("/auth")
public class AuthController {

    // POST /auth/login
    // 1. Load admin user from AdminUserService.findByUsername(req.username())
    // 2. If not found or password doesn't match → 401 with ErrorResponse("Invalid credentials")
    // 3. If valid → generate JWT with JwtUtil.generateToken(username)
    // 4. Return 200 with LoginResponse(token, expiresAt.toString())
}
```

#### `controller/OrderController.java`
```java
@RestController
@RequestMapping("/orders")
public class OrderController {

    // POST /orders          → @Valid CreateOrderRequest → service.createOrder() → 201
    // GET  /orders          → service.findAll() → 200 (auth required — handled by SecurityConfig)
    // GET  /orders/{id}     → service.findById() → 200 or 404
    // PATCH /orders/{id}    → @Valid UpdateOrderStatusRequest → service.updateStatus() → 200
}
```

#### `controller/ReservationController.java`
```java
@RestController
@RequestMapping("/reservations")
public class ReservationController {

    // POST /reservations         → service.createReservation() → 201
    // GET  /reservations         → service.findAll() or findByDate(date) → 200
    // GET  /reservations/{id}    → service.findById() → 200 or 404
    // PATCH /reservations/{id}   → service.updateReservation() → 200
}
```

#### `controller/EnquiryController.java`
```java
@RestController
@RequestMapping("/enquiries")
public class EnquiryController {

    // POST /enquiries            → service.createEnquiry() → 201
    // GET  /enquiries            → service.findAll() or findByStatus(status) → 200
    // PATCH /enquiries/{id}      → service.updateEnquiry() → 200
}
```

---

### 4.14 Exception Handling

#### `exception/NotFoundException.java`
```java
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) { super(message); }
}
```

#### `exception/ValidationException.java`
```java
public class ValidationException extends RuntimeException {
    public ValidationException(String message) { super(message); }
}
```

#### `exception/GlobalExceptionHandler.java`
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(NotFoundException ex) {
        return new ErrorResponse(ex.getMessage());
    }

    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidation(ValidationException ex) {
        return new ErrorResponse(ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBeanValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .findFirst()
            .orElse("Validation error");
        return new ErrorResponse(message);
    }
}
```

---

### 4.15 Admin User Bootstrap

#### `bootstrap/AdminUserBootstrap.java`
```java
package co.delos.api.bootstrap;

import co.delos.api.model.AdminUser;
import co.delos.api.service.AdminUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AdminUserBootstrap implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminUserBootstrap.class);

    private final AdminUserService adminUserService;
    private final String defaultUsername;
    private final String defaultPassword;

    public AdminUserBootstrap(
        AdminUserService adminUserService,
        @Value("${delos.admin.username}") String defaultUsername,
        @Value("${delos.admin.password}") String defaultPassword
    ) {
        this.adminUserService = adminUserService;
        this.defaultUsername = defaultUsername;
        this.defaultPassword = defaultPassword;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (adminUserService.findByUsername(defaultUsername).isEmpty()) {
            adminUserService.createUser(defaultUsername, defaultPassword);
            log.info("Default admin user '{}' created.", defaultUsername);
        } else {
            log.info("Admin user '{}' already exists. Skipping creation.", defaultUsername);
        }
    }
}
```

**Default credentials:**
- Username: `admin`
- Password: `DelosAdmin2026!`

These can be overridden at deploy time via the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables.

---

## 5. UI Project Changes

All changes happen inside `ui/`. The Next.js project structure stays the same.

### 5.1 Environment Variables

Create `ui/.env.production` (committed — non-secret):
```
NEXT_PUBLIC_API_URL=https://api.deloslounge.co.za
```

Create `ui/.env.local` (NOT committed — for local dev):
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 5.2 Delete These Files (replaced by the real API)
- `ui/src/app/api/` — entire directory
- `ui/src/lib/store.ts`

### 5.3 Restore `output: "export"` Workarounds

**Revert `next.config.ts`** to just:
```typescript
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};
```

The `force-static` and `generateStaticParams` hacks in the old API route files are gone because those files are deleted.

### 5.4 Update `formatPrice` in `ui/src/lib/utils.ts`

The API now returns prices in **cents**. Update the formatter:
```typescript
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
```

### 5.5 API Client Utility

Create `ui/src/lib/api.ts`:
```typescript
const BASE = process.env.NEXT_PUBLIC_API_URL!;

function authHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = sessionStorage.getItem("delos-admin-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  async post<T>(path: string, body: unknown, auth = false): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? authHeaders() : {}),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Request failed");
    return data as T;
  },

  async get<T>(path: string, auth = false): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      headers: auth ? authHeaders() : {},
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Request failed");
    return data as T;
  },

  async patch<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Request failed");
    return data as T;
  },
};
```

Token storage: `sessionStorage` key `"delos-admin-token"`. The token clears when the browser tab closes — suitable for admin use.

### 5.6 Admin Login Page

Create `ui/src/app/admin/login/page.tsx`:
- "use client"
- Form with username + password fields
- On submit: call `api.post("/auth/login", { username, password })`
- On success: store token in `sessionStorage.setItem("delos-admin-token", data.token)`
- Redirect to `/admin/orders`
- On failure: show error message "Invalid credentials"
- Page should be styled consistently with the dark/gold theme

### 5.7 Admin Auth Guard

Create `ui/src/components/AdminGuard.tsx`:
```tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("delos-admin-token");
    if (!token) router.replace("/admin/login");
  }, [router]);

  return <>{children}</>;
}
```

Wrap the admin orders and reservations pages with `<AdminGuard>`.

### 5.8 Update Admin Pages — Use Real API

**`ui/src/app/admin/orders/page.tsx`** — change all fetches:
```typescript
// Replace: fetch("/api/orders")
// With:    api.get<{ orders: Order[] }>("/orders", true)

// Replace: fetch(`/api/orders/${id}`, { method: "PATCH", ... })
// With:    api.patch<{ order: Order }>(`/orders/${id}`, { status })
```

**`ui/src/app/admin/reservations/page.tsx`** — change all fetches:
```typescript
// Replace: fetch("/api/reservations")
// With:    api.get<{ reservations: Reservation[] }>("/reservations", true)

// Replace: fetch(`/api/reservations/${id}`, { method: "PATCH", ... })
// With:    api.patch<{ reservation: Reservation }>(`/reservations/${id}`, { status })
```

Add an **Enquiries** tab to the admin dashboard. This is a new page at `ui/src/app/admin/enquiries/page.tsx`:
- Fetch from `GET /enquiries` (auth required)
- Display as a list with: name, phone, date, guest count, event type, package, status, admin notes
- Admin can update status and add notes via `PATCH /enquiries/{id}`
- Same polling pattern as orders/reservations (every 30s is fine for enquiries)

### 5.9 Update Order Page — Restore Full API Flow

Replace the WhatsApp redirect in `handleSubmit` with a real API call:

```typescript
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setSubmitError(null);

  if (cart.items.length === 0) { setSubmitError("Your cart is empty."); return; }
  if (belowMinimum) { setSubmitError(`Minimum order is ${formatPrice(minOrder * 100)}.`); return; }

  setSubmitting(true);
  try {
    const data = await api.post<{ order: Order }>("/orders", {
      customerName,
      phone,
      email: email || undefined,
      fulfilmentType,
      deliveryAddress: fulfilmentType === "delivery" ? deliveryAddress : undefined,
      items: cart.items.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
      orderNotes: orderNotes || undefined,
    });

    cart.clear();
    router.push(`/order/${data.order.id}`);
  } catch (err: unknown) {
    setSubmitError(err instanceof Error ? err.message : "Could not place order.");
    setSubmitting(false);
  }
}
```

Also update the "how it works" note to say "Pay on collection or delivery. Our team will confirm your order shortly."

### 5.10 Restore Order Confirmation Page

Restore `ui/src/app/order/[id]/page.tsx`. This is a client component that:
1. Reads the `id` from `useParams()`
2. On mount: calls `api.get<{ order: Order }>(`/orders/${id}`)`
3. Polls every 10 seconds while status is not `completed` or `cancelled`
4. Displays: order ID, status (with friendly label), items list, totals, estimated time
5. Shows a WhatsApp button to contact the restaurant if needed

Since the page uses `useParams` (client component), it works fine with `output: "export"`. Add it to the excluded-during-build workaround the same way as before (temporarily move during `npm run build`).

Actually — since the order confirmation page is a dynamic route (`/order/[id]`) and the export cannot pre-render it, it must be excluded from the static export build. The page still works at runtime because the browser fetches it as a client component. The build workaround (temporarily moving `[id]` out of `app/order/` during `npm run build`) must be kept.

### 5.11 Update Bookings Page

`ui/src/app/bookings/page.tsx` — update the form submission:
```typescript
// Replace: fetch("/api/reservations", { method: "POST", ... })
// With:    api.post<{ reservation: Reservation }>("/reservations", formData)
```

No other changes needed — the confirmation view is already correct.

### 5.12 Wire Up Private Functions Enquiry Form

`ui/src/app/private-functions/page.tsx` — the enquiry form is currently non-functional. Make it work:

```typescript
// Make the page a client component: add "use client" at the top
// Add form state: name, phone, email, date, guestCount, eventType, packageName, details
// Pre-fill packageName if the user clicked "Enquire Now" on a specific package card
//   (pass packageName as a query param: /private-functions?package=NAME)
// On submit: api.post<{ enquiry: Enquiry }>("/enquiries", formData)
// On success: show confirmation with enquiry ID and message
//   "Thank you! We'll be in touch within 24 hours."
```

---

## 6. AWS Infrastructure

### 6.1 DynamoDB Tables

Run these AWS CLI commands to create the tables in `us-east-1`:

```bash
# Orders table
aws dynamodb create-table \
  --table-name delos-orders \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Reservations table
aws dynamodb create-table \
  --table-name delos-reservations \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Enquiries table
aws dynamodb create-table \
  --table-name delos-enquiries \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Users table
aws dynamodb create-table \
  --table-name delos-users \
  --attribute-definitions \
    AttributeName=username,AttributeType=S \
  --key-schema AttributeName=username,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

Verify all four tables are ACTIVE before proceeding:
```bash
aws dynamodb list-tables --region us-east-1
```

### 6.2 Elastic Beanstalk Application

The existing pattern in this AWS account: Spring Boot on **Elastic Beanstalk with Corretto 21 (Amazon Linux 2023)** in `us-east-1`. Follow the same approach.

```bash
# Create application
aws elasticbeanstalk create-application \
  --application-name delos-api \
  --description "Delos Lounge & Dining API" \
  --region us-east-1

# Create environment (t3.micro — within free tier)
aws elasticbeanstalk create-environment \
  --application-name delos-api \
  --environment-name delos-api-prod \
  --solution-stack-name "64bit Amazon Linux 2023 v4.9.0 running Corretto 21" \
  --option-settings \
    "Namespace=aws:autoscaling:launchconfiguration,OptionName=InstanceType,Value=t3.micro" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=SPRING_PROFILES_ACTIVE,Value=prod" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=DYNAMODB_REGION,Value=us-east-1" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=ORDERS_TABLE,Value=delos-orders" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=RESERVATIONS_TABLE,Value=delos-reservations" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=ENQUIRIES_TABLE,Value=delos-enquiries" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=USERS_TABLE,Value=delos-users" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=JWT_SECRET,Value=REPLACE_WITH_32_CHAR_SECRET" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=CORS_ALLOWED_ORIGINS,Value=https://www.deloslounge.co.za,https://d1t1afsdwlqzlq.cloudfront.net" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=ADMIN_USERNAME,Value=admin" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=ADMIN_PASSWORD,Value=DelosAdmin2026!" \
  --region us-east-1
```

**Generate the JWT secret** (must be ≥ 32 characters):
```bash
openssl rand -base64 48
# Copy the output and use it as JWT_SECRET above
```

### 6.3 IAM Role for Elastic Beanstalk → DynamoDB

The EB EC2 instance needs permission to read/write DynamoDB. Attach a policy to the `aws-elasticbeanstalk-ec2-role`:

```bash
aws iam put-role-policy \
  --role-name aws-elasticbeanstalk-ec2-role \
  --policy-name delos-dynamodb-access \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:861870144419:table/delos-orders",
        "arn:aws:dynamodb:us-east-1:861870144419:table/delos-reservations",
        "arn:aws:dynamodb:us-east-1:861870144419:table/delos-enquiries",
        "arn:aws:dynamodb:us-east-1:861870144419:table/delos-users"
      ]
    }]
  }'
```

### 6.4 CloudFront in Front of the API

To serve the API over HTTPS without managing certificates on EB, create a CloudFront distribution pointing to the EB environment:

```bash
aws cloudfront create-distribution \
  --distribution-config '{
    "CallerReference": "delos-api-'$(date +%s)'",
    "Comment": "Delos API",
    "DefaultCacheBehavior": {
      "TargetOriginId": "delos-api-eb",
      "ViewerProtocolPolicy": "redirect-to-https",
      "AllowedMethods": {
        "Quantity": 7,
        "Items": ["GET","HEAD","OPTIONS","PUT","POST","PATCH","DELETE"],
        "CachedMethods": { "Quantity": 2, "Items": ["GET","HEAD"] }
      },
      "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
      "OriginRequestPolicyId": "b689b0a8-53d0-40ab-baf2-68738e2966ac",
      "Compress": true
    },
    "Origins": {
      "Quantity": 1,
      "Items": [{
        "Id": "delos-api-eb",
        "DomainName": "REPLACE_WITH_EB_CNAME",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }]
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100"
  }'
```

Replace `REPLACE_WITH_EB_CNAME` with the EB environment CNAME from step 6.2.

The CloudFront domain for the API becomes `NEXT_PUBLIC_API_URL` in the UI.

---

## 7. Build and Deploy

### 7.1 API — Build and Deploy to Elastic Beanstalk

```bash
cd api

# Build fat JAR
mvn clean package -DskipTests

# The JAR will be at: target/api-0.0.1-SNAPSHOT.jar

# Deploy to Elastic Beanstalk
# First time: create an S3 bucket for EB deployments
aws s3 mb s3://delos-eb-deployments --region us-east-1

# Upload JAR
aws s3 cp target/api-0.0.1-SNAPSHOT.jar \
  s3://delos-eb-deployments/api-$(date +%Y%m%d-%H%M%S).jar

# Create EB application version
aws elasticbeanstalk create-application-version \
  --application-name delos-api \
  --version-label "v$(date +%Y%m%d-%H%M%S)" \
  --source-bundle S3Bucket=delos-eb-deployments,S3Key=api-$(date +%Y%m%d-%H%M%S).jar \
  --region us-east-1

# Update environment to new version
aws elasticbeanstalk update-environment \
  --environment-name delos-api-prod \
  --version-label "v$(date +%Y%m%d-%H%M%S)" \
  --region us-east-1
```

> **Tip:** Wrap this in a `api/deploy.sh` script for convenience.

### 7.2 UI — Build and Deploy to S3 + CloudFront

```bash
cd ui

# Move dynamic route out (static export workaround)
mv src/app/order/\[id\] /tmp/delos-order-id-backup
mv src/app/api /tmp/delos-api-backup 2>/dev/null || true

# Build
npm run build

# Restore
mv /tmp/delos-order-id-backup src/app/order/\[id\]
mv /tmp/delos-api-backup src/app/api 2>/dev/null || true

# Sync to S3
aws s3 sync out/ s3://delos-lounge-website/ \
  --region af-south-1 \
  --delete \
  --exclude "*.html" \
  --cache-control "public, max-age=31536000, immutable"

aws s3 sync out/ s3://delos-lounge-website/ \
  --region af-south-1 \
  --exclude "*" --include "*.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html; charset=utf-8"

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id E2LH36Y7GBUMP7 \
  --paths "/*"
```

> **Tip:** Wrap this in `ui/deploy.sh`.

---

## 8. Local Development

### 8.1 Start DynamoDB Local
```bash
docker run -d -p 8000:8000 --name delos-dynamo amazon/dynamodb-local
```

### 8.2 Create Local Tables
```bash
for table in delos-orders delos-reservations delos-enquiries delos-users; do
  aws dynamodb create-table \
    --table-name $table \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url http://localhost:8000 \
    --region us-east-1 2>/dev/null || echo "$table already exists"
done

# Users table has username as PK (not id)
aws dynamodb create-table \
  --table-name delos-users \
  --attribute-definitions AttributeName=username,AttributeType=S \
  --key-schema AttributeName=username,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000 \
  --region us-east-1 2>/dev/null || echo "delos-users already exists"
```

### 8.3 Start API
```bash
cd api
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

The API starts on `http://localhost:8080`. The bootstrap creates the default admin user on first run.

### 8.4 Start UI
```bash
cd ui
npm run dev
```

UI starts on `http://localhost:3000`. `NEXT_PUBLIC_API_URL=http://localhost:8080` is read from `.env.local`.

### 8.5 Test the Flow
```bash
# 1. Login as admin
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"DelosAdmin2026!"}'
# → { "token": "eyJ...", "expiresAt": "..." }

# 2. Place a test order (public)
curl -X POST http://localhost:8080/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Test","phone":"082 000 0000","fulfilmentType":"collection","items":[{"menuItemId":"ITEM_ID_HERE","quantity":1}]}'

# 3. List orders (admin)
curl http://localhost:8080/orders \
  -H "Authorization: Bearer TOKEN_FROM_STEP_1"
```

---

## 9. Summary of Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| API framework | Spring Boot 3 + Spring Security | Matches existing Omnisolve/CGS APIs in this AWS account |
| Java version | Java 21 (Corretto 21) | Matches existing EB solution stacks in the account |
| Auth | JWT (JJWT) + BCrypt | Stateless, works with static UI on S3, no session infra needed |
| Default admin | username: `admin` / password: `DelosAdmin2026!` | Created on startup via `AdminUserBootstrap` |
| Database | DynamoDB (PAY_PER_REQUEST) | Permanent free tier, no connection management, serverless |
| API hosting | Elastic Beanstalk (t3.micro, us-east-1) | Same as other apps in account, familiar deploy pattern |
| API HTTPS | CloudFront in front of EB | No cert management on EB, same pattern as Omnisolve |
| UI hosting | S3 + CloudFront (af-south-1) | Existing setup — unchanged |
| Order flow | Full API-backed (no WhatsApp redirect) | Reliable, trackable, admin-visible |
| Prices | Stored as ZAR cents (integers) | Avoids float rounding errors |
| Static export workaround | Temporarily move `order/[id]` during build | Required for `output: export` with dynamic routes |

---

## 10. Files to Create — Checklist

### Repository root
- [ ] `.gitignore` (updated)

### `shared/`
- [ ] `openapi.yaml`

### `api/`
- [ ] `pom.xml` (from Spring Initializr + extra deps)
- [ ] `src/main/resources/application.properties`
- [ ] `src/main/resources/application-local.properties` (not committed)
- [ ] `DelosApiApplication.java`
- [ ] `config/DynamoDbConfig.java`
- [ ] `config/SecurityConfig.java`
- [ ] `config/CorsConfig.java`
- [ ] `security/JwtUtil.java`
- [ ] `security/JwtAuthFilter.java`
- [ ] `model/Order.java`
- [ ] `model/Reservation.java`
- [ ] `model/Enquiry.java`
- [ ] `model/AdminUser.java`
- [ ] `repository/OrderRepository.java`
- [ ] `repository/ReservationRepository.java`
- [ ] `repository/EnquiryRepository.java`
- [ ] `repository/AdminUserRepository.java`
- [ ] `service/IdGenerator.java`
- [ ] `service/OrderService.java`
- [ ] `service/ReservationService.java`
- [ ] `service/EnquiryService.java`
- [ ] `service/AdminUserService.java`
- [ ] `controller/AuthController.java`
- [ ] `controller/OrderController.java`
- [ ] `controller/ReservationController.java`
- [ ] `controller/EnquiryController.java`
- [ ] `dto/request/CreateOrderRequest.java`
- [ ] `dto/request/CreateReservationRequest.java`
- [ ] `dto/request/CreateEnquiryRequest.java`
- [ ] `dto/request/UpdateOrderStatusRequest.java`
- [ ] `dto/request/UpdateReservationRequest.java`
- [ ] `dto/request/UpdateEnquiryRequest.java`
- [ ] `dto/request/LoginRequest.java`
- [ ] `dto/response/LoginResponse.java`
- [ ] `dto/response/ErrorResponse.java`
- [ ] `exception/NotFoundException.java`
- [ ] `exception/ValidationException.java`
- [ ] `exception/GlobalExceptionHandler.java`
- [ ] `bootstrap/AdminUserBootstrap.java`
- [ ] `menu/MenuRegistry.java` (populated from `ui/src/lib/menu.ts`)
- [ ] `deploy.sh`

### `ui/` (changes to existing files)
- [ ] `next.config.ts` (revert to clean version with `images: { unoptimized: true }`)
- [ ] `.env.production` (add `NEXT_PUBLIC_API_URL`)
- [ ] `.env.local` (not committed)
- [ ] `src/lib/utils.ts` (update `formatPrice` to divide by 100)
- [ ] `src/lib/api.ts` (new — API client)
- [ ] `src/app/admin/login/page.tsx` (new)
- [ ] `src/components/AdminGuard.tsx` (new)
- [ ] `src/app/admin/orders/page.tsx` (update fetch calls)
- [ ] `src/app/admin/reservations/page.tsx` (update fetch calls)
- [ ] `src/app/admin/enquiries/page.tsx` (new)
- [ ] `src/app/order/page.tsx` (restore API-backed submit)
- [ ] `src/app/order/[id]/page.tsx` (restore confirmation page)
- [ ] `src/app/bookings/page.tsx` (update fetch call)
- [ ] `src/app/private-functions/page.tsx` (wire up enquiry form)
- [ ] `deploy.sh`

### Delete
- [ ] `ui/src/app/api/` (entire directory)
- [ ] `ui/src/lib/store.ts`
