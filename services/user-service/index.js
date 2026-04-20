import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { Pool } from 'pg';
import { Kafka } from 'kafkajs';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

// Kafka setup
const kafka = new Kafka({
  clientId: 'user-service',
  brokers: (process.env.KAFKA_BROKERS || 'kafka:29092').split(','),
});
const producer = kafka.producer();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// POST /auth/register
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name',
      [email, hashedPassword, first_name, last_name]
    );

    const user = result.rows[0];
    
    // Publish UserRegistered event
    await producer.send({
      topic: 'UserRegistered',
      messages: [{ value: JSON.stringify({ userId: user.id, email: user.email }) }]
    });
    console.log(`Event UserRegistered sent for user ${user.id}`);

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /auth/login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({ user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name }, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'User Service is running' });
});

// Start server after connecting Kafka
const start = async () => {
  try {
    await producer.connect();
    app.listen(PORT, () => {
      console.log(`User Service listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start User Service:', error);
    process.exit(1);
  }
};

start();

