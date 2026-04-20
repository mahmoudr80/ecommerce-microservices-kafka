# 🛒 E-commerce Microservices System (Kafka)

This project is a simple event-driven microservices system built using:

* Node.js (Express)
* Apache Kafka
* PostgreSQL
* Docker & Docker Compose

## 🧩 Services

* **User Service** → Handles user registration & login
* **Product Service** → Manages products and stock
* **Order Service** → Creates orders and publishes events

## 🔄 Event Flow

User Service → **UserRegistered** → Order Service
Order Service → **OrderPlaced** → Product Service

## 🚀 How to Run

```bash
docker-compose up --build
```

## 🧪 API Endpoints

### User Service

* POST `/auth/register`
* POST `/auth/login`

### Product Service

* GET `/products`
* POST `/products`

### Order Service

* POST `/orders`
* GET `/orders/:id`

## 📡 Kafka Events

* `UserRegistered`
* `OrderPlaced`

## 🐳 Features

* Microservices architecture
* Event-driven communication (Kafka)
* REST APIs
* Dockerized services

## 🎯 Purpose

Built as a university project to demonstrate:

* Microservices
* Event-driven systems
* Kafka integration
* Docker orchestration
