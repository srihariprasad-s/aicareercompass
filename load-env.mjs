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
  
  // Add dotenv config at the beginning of the file
  if (!content.includes('dotenv')) {
    content = `import 'dotenv/config';\n${content}`;
    fs.writeFileSync(indexPath, content);
    console.log('Successfully added dotenv configuration');
  } else {
    console.log('dotenv configuration already exists');
  }
} catch (error) {
  console.error('Error:', error.message);
}