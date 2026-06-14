const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
  path.join(process.cwd(), 'public', 'images'),
  path.join(process.cwd(), 'public', 'upload', 'galeri')
];

const MAX_WIDTH = 1920;
const QUALITY = 80;

async function processImages() {
  let totalProcessed = 0;
  let totalSavedBytes = 0;

  console.log('Starting image optimization process...');

  for (const dir of DIRECTORIES) {
    if (!fs.existsSync(dir)) {
      console.warn(`Directory not found, skipping: ${dir}`);
      continue;
    }

    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const filePath = path.join(dir, file);
        const webpFilePath = path.join(dir, file.replace(new RegExp(`${ext}$`, 'i'), '.webp'));
        
        try {
          const statBefore = fs.statSync(filePath);
          
          // Get image metadata
          const metadata = await sharp(filePath).metadata();
          
          // Resize if wider than MAX_WIDTH, otherwise keep original size
          const resizeOptions = metadata.width > MAX_WIDTH ? { width: MAX_WIDTH, withoutEnlargement: true } : {};

          // Convert to WebP
          await sharp(filePath)
            .resize(resizeOptions)
            .webp({ quality: QUALITY })
            .toFile(webpFilePath);
          
          const statAfter = fs.statSync(webpFilePath);
          const savedBytes = statBefore.size - statAfter.size;
          totalSavedBytes += savedBytes;
          totalProcessed++;

          console.log(`Converted: ${file} -> ${path.basename(webpFilePath)} (Saved ${(savedBytes / 1024).toFixed(2)} KB)`);

          // Delete the original file as requested
          fs.unlinkSync(filePath);
          
        } catch (error) {
          console.error(`Failed to process ${file}:`, error);
        }
      }
    }
  }

  console.log('\n--- Optimization Complete ---');
  console.log(`Total images converted: ${totalProcessed}`);
  console.log(`Total space saved: ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB`);
}

processImages();
