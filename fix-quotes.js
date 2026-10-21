const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/dashboard/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace curly quotes with straight quotes
content = content.replace(/"/g, '"');
content = content.replace(/"/g, '"');
content = content.replace(/'/g, "'");
content = content.replace(/'/g, "'");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed curly quotes in dashboard/page.tsx');
