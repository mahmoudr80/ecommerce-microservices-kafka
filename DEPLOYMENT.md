# Hotel Booking Microservices System

A comprehensive hotel booking platform built with React frontend and Node.js microservices architecture.

## Architecture Overview

### Frontend
- **React 19** with TypeScript
- **Next.js 16** for framework and routing
- **Shadcn/ui** for UI components
- **TailwindCSS** for styling

### Backend Services (Microservices)
1. **User Service** (Port 3001) - Authentication and user management
2. **Hotel Service** (Port 3002) - Hotel search and management
3. **Room Service** (Port 3003) - Room inventory and availability
4. **Booking Service** (Port 3004) - Booking management
5. **Payment Service** (Port 3005) - Payment processing with Stripe
6. **Notification Service** (Port 3006) - Email notifications
7. **Review Service** (Port 3007) - Reviews and ratings
8. **API Gateway** (Port 3000) - Route aggregation and load balancing

### Infrastructure
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Message Queue**: Apache Kafka 7.4
- **Orchestration**: Docker Compose
- **Payment Provider**: Stripe

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15 (if running services locally)
- Stripe account (for payment processing)

## Setup Instructions

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
# Database
DB_USER=admin
DB_PASSWORD=your_secure_password
DB_NAME=hotel_booking

# JWT
JWT_SECRET=your_jwt_secret_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Node Environment
NODE_ENV=development
```

### 2. Start Services with Docker Compose

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Redis cache
- Kafka message broker
- All 7 microservices
- API Gateway

### 3. Initialize Database

Run the database migration script:

```bash
# Using PostgreSQL client
psql -U admin -d hotel_booking -f scripts/01-init-schema.sql

# Or using Docker
docker exec hotel_postgres psql -U admin -d hotel_booking -f /scripts/01-init-schema.sql
```

### 4. Start Frontend

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000` (or the next available port).

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Hotels
- `GET /api/hotels` - Search hotels
- `GET /api/hotels/:id` - Get hotel details
- `POST /api/hotels` - Create new hotel (owner only)

### Rooms
- `GET /api/rooms` - List rooms
- `GET /api/rooms/hotel/:hotel_id` - Get hotel rooms
- `POST /api/rooms` - Add new room (owner only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `GET /api/bookings/user/:user_id` - Get user bookings
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/:id` - Get payment details
- `POST /api/payments/webhook` - Stripe webhook

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/hotel/:hotel_id` - Get hotel reviews

### Notifications
- `GET /api/notifications/user/:user_id` - Get user notifications
- `PUT /api/notifications/:id` - Mark as read

## Service Dependencies

```
API Gateway
├── User Service (Database)
├── Hotel Service (Database)
├── Room Service (Database)
├── Booking Service (Database)
├── Payment Service (Database, Stripe)
├── Notification Service (Database, Kafka, SMTP)
└── Review Service (Database)
```

## Development Workflow

### Adding New Microservices

1. Create service directory in `services/`
2. Create `index.js` with Express app
3. Create `Dockerfile`
4. Add service to `docker-compose.yml`
5. Add route to `services/api-gateway/index.js`

### Database Migrations

Create new migration files with version numbers:
- `scripts/02-add-new-feature.sql`
- `scripts/03-update-schema.sql`

Run migrations in order before deploying.

### Kafka Event Streaming

Services can publish events to Kafka topics for async processing:

```javascript
const kafka = new Kafka({
  clientId: 'booking-service',
  brokers: ['kafka:29092']
});

const producer = kafka.producer();
await producer.send({
  topic: 'booking-events',
  messages: [
    { value: JSON.stringify({ type: 'BOOKING_CREATED', booking_id: '...' }) }
  ]
});
```

## Deployment

### Docker Compose (Local/Development)
```bash
docker-compose up -d
```

### Kubernetes (Production)
Create Kubernetes manifests for each service with:
- Deployments
- Services
- ConfigMaps for environment variables
- PersistentVolumeClaims for database

### Vercel (Frontend)
```bash
npm run build
vercel deploy
```

Set environment variables in Vercel project settings and point to production API Gateway URL.

## Monitoring & Logging

### Logs
```bash
# View all services
docker-compose logs -f

# View specific service
docker-compose logs -f user-service
```

### Health Checks
All services expose `/health` endpoint:
```bash
curl http://localhost:3000/health
curl http://localhost:3001/health
```

## Troubleshooting

### Services won't start
1. Check Docker is running
2. Verify ports are not in use
3. Check environment variables in `.env`

### Database connection errors
1. Ensure PostgreSQL is running
2. Verify connection string
3. Run migrations

### Payment errors
1. Verify Stripe keys are correct
2. Check webhook configuration
3. Review Stripe logs

## Security Best Practices

- Use HTTPS in production
- Implement rate limiting on API Gateway
- Use Row-Level Security (RLS) on database
- Validate and sanitize all inputs
- Use environment variables for secrets
- Implement JWT token refresh
- Add CORS policies appropriately

## Contributing

1. Create feature branch
2. Make changes
3. Test locally with Docker Compose
4. Submit pull request

## License

MIT
