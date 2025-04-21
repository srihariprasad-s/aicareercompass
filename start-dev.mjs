import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startDev() {
  console.log('Starting Vite development server...');
  
  try {
    const configPath = path.join(__dirname, 'simple-vite.config.js');
    const server = await createServer({
      configFile: configPath,
      root: __dirname,
      server: {
        port: 5000,
        host: 'localhost'
      }
    });
    
    await server.listen();
    
    server.printUrls();
    console.log('Vite server started successfully.');
  } catch (error) {
    console.error('Error starting Vite server:', error);
  }
}

startDev();