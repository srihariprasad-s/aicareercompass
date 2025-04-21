import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the ai-service.ts file
const aiServicePath = path.join(__dirname, 'server', 'ai-service.ts');

try {
  // Read the file
  let content = fs.readFileSync(aiServicePath, 'utf8');

  // Change the default provider to one you have an API key for
  content = content.replace(
    'let currentProvider: AIProvider = "huggingface";', 
    'let currentProvider: AIProvider = "openai";'
  );

  // Write back the modified file
  fs.writeFileSync(aiServicePath, content);
  console.log('Successfully modified ai-service.ts');
} catch (error) {
  console.error('Error:', error.message);
}