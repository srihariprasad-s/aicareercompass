import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to server index.ts file
const indexPath = path.join(__dirname, 'server', 'index.ts');

try {
  // Read the file
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Replace 0.0.0.0 with localhost (127.0.0.1)
  if (content.includes('0.0.0.0')) {
    content = content.replace(/0\.0\.0\.0/g, '127.0.0.1');
    fs.writeFileSync(indexPath, content);
    console.log('Successfully changed server binding from 0.0.0.0 to 127.0.0.1');
  } else {
    console.log('Server not binding to 0.0.0.0, no changes needed');
  }
} catch (error) {
  console.error('Error:', error.message);
}