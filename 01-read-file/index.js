const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdout: output } = require('process');

const filePath = path.join(__dirname, 'text.txt');
readline.createInterface({ input: fs.createReadStream(filePath), output });
