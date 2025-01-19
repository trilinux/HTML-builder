const fs = require('fs');
const path = require('path');

const escapeHTML = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const filePath = path.join(__dirname, 'output.txt');
const writableStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log(
  'Heya, enter text to save to the file. Type "exit" or press Ctrl+C to quit.\n',
);

const exitHandler = () => {
  console.log('\nThank you! Goodbye!');
  writableStream.end();
  process.exit();
};

process.stdin.on('data', (data) => {
  const input = data.toString().trim();

  if (input === 'exit') {
    exitHandler();
  } else {
    const escapedInput = escapeHTML(input);
    writableStream.write(escapedInput + '\n');
  }
});

process.on('SIGINT', exitHandler);
