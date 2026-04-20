import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { Kafka } from 'kafkajs';

const app = express();
const PORT = process.env.PORT || 3003;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

// Kafka setup
const kafka = new Kafka({
  clientId: 'order-service',
  brokers: (process.env.KAFKA_BROKERS || 'kafka:29092').split(','),
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'order-group' });

// Kafka Consumer for UserRegistered
const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'UserRegistered', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      console.log(`[Order Service] User ${event.userId} is now registered and can place orders`);
      // Logic to handle user registration if needed (e.g., sync user data)
    },
  });
};

// Routes
app.post('/orders', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // 1. Get product price
    const productResult = await pool.query('SELECT price FROM products WHERE id = $1', [productId]);
    if (productResult.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    
    const price = productResult.rows[0].price;
    const totalPrice = price * quantity;

    // 2. Create order
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, productId, quantity, totalPrice, 'pending']
    );

    const order = orderResult.rows[0];

    // 3. Publish OrderPlaced event
    await producer.send({
      topic: 'OrderPlaced',
      messages: [
        {
          key: String(order.id),
          value: JSON.stringify({
            orderId: order.id,
            userId,
            productId,
            quantity,
            totalPrice
          }),
        },
      ],
    });
    console.log(`Event OrderPlaced sent for order ${order.id}`);

    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/orders/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'Order Service is running' });
});

const start = async () => {
  await producer.connect();
  runConsumer().catch(console.error);
  app.listen(PORT, () => {
    console.log(`Order Service listening on port ${PORT}`);
  });
};

start().catch(console.error);
