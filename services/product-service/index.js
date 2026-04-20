import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { Kafka } from 'kafkajs';

const app = express();
const PORT = process.env.PORT || 3002;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

// Kafka setup
const kafka = new Kafka({
  clientId: 'product-service',
  brokers: (process.env.KAFKA_BROKERS || 'kafka:29092').split(','),
});

const consumer = kafka.consumer({ groupId: 'product-group' });

// Routes
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/products', async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const result = await pool.query(
      'INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING *',
      [name, price, stock]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Kafka Consumer for OrderPlaced
const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'OrderPlaced', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      console.log(`[Product Service] Received event: ${topic}`, event);

      if (topic === 'OrderPlaced') {
        const { productId, quantity } = event;
        console.log(`[Product Service] Processing order for product ${productId} with quantity ${quantity}`);
        try {
          await pool.query(
            'UPDATE products SET stock = stock - $1 WHERE id = $2',
            [quantity, productId]
          );
          console.log(`[Product Service] Updated stock for product ${productId}`);
        } catch (error) {
          console.error('[Product Service] Error updating stock:', error);
        }
      }
    },
  });
};

app.get('/health', (req, res) => {
  res.json({ status: 'Product Service is running' });
});

app.listen(PORT, () => {
  console.log(`Product Service listening on port ${PORT}`);
  runConsumer().catch(console.error);
});
