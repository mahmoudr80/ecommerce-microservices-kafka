# Simple Microservices Demo (E-Commerce)

This project demonstrates a simple microservices architecture using Docker, Kafka, and Node.js.

## Services
1.  **User Service**: Handles user registration and publishes `UserRegistered` events.
2.  **Product Service**: Lists products and updates stock based on `OrderPlaced` events.
3.  **Order Service**: Creates orders and publishes `OrderPlaced` events.

## Prerequisites
- Docker & Docker Compose

## How to Execute

### 1. Start the System
Run the following command in the root directory:
```bash
docker-compose up --build
```
*Wait about 30-60 seconds for Postgres and Kafka to be fully ready.*

### 2. Register a User
Open a new terminal and run:
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```
*Take note of the `id` from the response.*

### 3. Check Products
```bash
curl http://localhost:3002/products
```
*Take note of a product `id` and its current `stock` (e.g., Laptop has 10).*

### 4. Place an Order
Replace `USER_ID` and `PRODUCT_ID` with the IDs from steps 2 and 3:
```bash
curl -X POST http://localhost:3003/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "productId": "PRODUCT_ID",
    "quantity": 1
  }'
```

### 5. Verify Event Flow (Stock Update)
Check the products again:
```bash
curl http://localhost:3002/products
```
*The stock of the ordered product should have decreased by 1.*

## Monitoring Logs
You can watch the services talk to each other:
```bash
docker-compose logs -f product-service order-service
```
You will see:
- `[Order Service] Published OrderPlaced event`
- `[Product Service] Received event: OrderPlaced`
- `[Product Service] Updated stock for product ...`

## Cleanup
```bash
docker-compose down -v
```
