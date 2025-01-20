const fs = require('fs').promises;
const path = require('path');

const distFolder = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');
const stylesFolder = path.join(__dirname, 'styles');
const assetsFolder = path.join(__dirname, 'assets');

async function createFolder(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    console.error(`Error creating directory: ${err}`);
  }
}

async function processTemplate() {
  let template = await fs.readFile(templateFile, 'utf8');

  const tagPattern = /{{(.*?)}}/g;
  const matches = template.match(tagPattern);

  if (matches) {
    for (let match of matches) {
      const tagName = match.slice(2, -2).trim();
      const componentFile = path.join(componentsFolder, `${tagName}.html`);

      try {
        const componentContent = await fs.readFile(componentFile, 'utf8');
        template = template.replace(match, componentContent);
      } catch (err) {
        console.error(`Error reading component ${tagName}: ${err}`);
      }
    }
  }

  await fs.writeFile(path.join(distFolder, 'index.html'), template);
}

async function compileCSS() {
  const cssFiles = await fs.readdir(stylesFolder);
  const cssContent = [];

  for (const file of cssFiles) {
    if (path.extname(file) === '.css') {
      const filePath = path.join(stylesFolder, file);
      const content = await fs.readFile(filePath, 'utf8');
      cssContent.push(content);
    }
  }

  const compiledCSS = cssContent.join('\n');
  await fs.writeFile(path.join(distFolder, 'style.css'), compiledCSS);
}

async function copyAssets() {
  const assetsDist = path.join(distFolder, 'assets');
  await createFolder(assetsDist);

  const assetItems = await fs.readdir(assetsFolder, { withFileTypes: true });

  for (const item of assetItems) {
    const srcPath = path.join(assetsFolder, item.name);
    const destPath = path.join(assetsDist, item.name);

    if (item.isDirectory()) {
      await createFolder(destPath);
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function copyDirectory(src, dest) {
  const items = await fs.readdir(src, { withFileTypes: true });

  for (const item of items) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    if (item.isDirectory()) {
      await createFolder(destPath);
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function build() {
  try {
    await createFolder(distFolder);

    await processTemplate();

    await compileCSS();

    await copyAssets();

    console.log('Build completed successfully!');
  } catch (err) {
    console.error(`Build failed: ${err}`);
  }
}

build();
