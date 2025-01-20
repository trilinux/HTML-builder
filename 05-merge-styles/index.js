const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputFile = path.join(__dirname, 'project-dist', 'bundle.css');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) throw err;
});

const writeStream = fs.createWriteStream(outputFile);

fs.readdir(stylesDir, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const filePath = path.join(stylesDir, file);

    if (path.extname(file) === '.css') {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) throw err;
        writeStream.write(data + '\n');
      });
    }
  });
});
