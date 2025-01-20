const fs = require('fs/promises');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');
const listOfFiles = [];

async function processFolder(folderPath) {
  try {
    const entries = await fs.readdir(folderPath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const entryPath = path.join(folderPath, entry.name);

      if (entry.isFile()) {
        const stats = await fs.stat(entryPath);

        const fileName = path.parse(entry.name).name;
        const fileExt = path.extname(entry.name).slice(1);

        const fileSizeKB = stats.size / 1024;
        const fileInfo = `${fileName} - ${fileExt || '(no file ext)'} - ${
          fileSizeKB ? fileSizeKB.toFixed(3) : 0
        } KB`;

        listOfFiles.push({
          info: fileInfo,
          size: fileSizeKB,
        });
      } else if (entry.isDirectory()) {
        await processFolder(entryPath);
      }
    }
  } catch (error) {
    console.error('Error reading the folder:', error);
  }
}

processFolder(secretFolderPath).then(() => {
  listOfFiles
    .sort((a, b) => a.size - b.size)
    .forEach(({ info }) => console.log(info));
});
