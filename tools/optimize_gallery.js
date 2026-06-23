const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const GALLERY_DIR = path.join(__dirname, '../public/upload/galeri');
const DB_PATH = path.join(__dirname, '../data/db.json');

// Supported extensions for conversion
const EXTS = ['.jpg', '.jpeg', '.png'];

async function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTS.includes(ext)) {
        const basename = path.basename(entry.name, ext);
        const webpPath = path.join(dirPath, `${basename}.webp`);
        
        console.log(`Processing: ${fullPath}`);
        try {
          const image = sharp(fullPath);
          const metadata = await image.metadata();

          let transform = image;
          if (metadata.width > 1920) {
            transform = transform.resize({ width: 1920, withoutEnlargement: true });
          }

          await transform
            .webp({ quality: 80, effort: 6 })
            .toFile(webpPath);
          
          console.log(`  -> Saved: ${webpPath}`);
          
          // Delete original file
          fs.unlinkSync(fullPath);
          console.log(`  -> Deleted original: ${fullPath}`);
        } catch (error) {
          console.error(`Error processing ${fullPath}:`, error);
        }
      }
    }
  }
}

function updateDbJson() {
  console.log(`Updating db.json...`);
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  let updatedCount = 0;

  if (data.gallery && Array.isArray(data.gallery)) {
    for (let i = 0; i < data.gallery.length; i++) {
      const item = data.gallery[i];
      if (item.url) {
        const ext = path.extname(item.url).toLowerCase();
        if (EXTS.includes(ext)) {
          const newUrl = item.url.substring(0, item.url.lastIndexOf('.')) + '.webp';
          item.url = newUrl;
          updatedCount++;
        }
      }
    }
  }

  if (updatedCount > 0) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    console.log(`Updated ${updatedCount} entries in db.json.`);
  } else {
    console.log(`No entries needed updating in db.json.`);
  }
}

async function main() {
  console.log('Starting WebP Optimization...');
  await processDirectory(GALLERY_DIR);
  updateDbJson();
  console.log('Optimization complete!');
}

main();
