import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

// Basic route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// API route for provider info
app.get('/api/current-provider', (req, res) => {
  res.json({ 
    provider: "huggingface", 
    message: "Current AI provider: Hugging Face" 
  });
});

// Listen on localhost instead of 0.0.0.0
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});