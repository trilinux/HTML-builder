const fs = require('fs');
const path = require('path');

async function copyDir() {
  const sourceDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');

  try {
    await fs.promises.rm(destDir, { recursive: true, force: true });
  } catch (err) {
    console.log(err);
  }

  await fs.promises.mkdir(destDir, { recursive: true });
  const files = await fs.promises.readdir(sourceDir);

  for (const file of files) {
    const sourceFile = path.join(sourceDir, file);
    const destFile = path.join(destDir, file);

    await fs.promises.copyFile(sourceFile, destFile);
  }
}

copyDir();
