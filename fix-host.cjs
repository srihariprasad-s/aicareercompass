const fs = require('fs');
const path = require('path');

// Path to server index.ts file
const indexPath = path.join(__dirname, 'server', 'index.ts');

try {
  // Read the file
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Replace 0.0.0.0 with localhost
  if (content.includes('0.0.0.0')) {
    content = content.replace(/0\.0\.0\.0/g, 'localhost');
    fs.writeFileSync(indexPath, content);
    console.log('Successfully changed binding from 0.0.0.0 to localhost');
  } else {
    console.log('No need to change binding');
  }
} catch (error) {
  console.error('Error:', error.message);
}