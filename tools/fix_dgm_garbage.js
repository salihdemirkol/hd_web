const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/efendilik_content.json');
const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// Function to check if a string is mostly garbage
function isGarbage(text) {
  // If it's very short and just some symbols
  if (text.length < 5 && /^[^\w\sığüşöçIĞÜŞÖÇ]+$/.test(text)) return true;
  
  // If it contains a long string of weird symbols
  const symbolMatch = text.match(/[!@#$%^&*\(\)_+\=\[\]\{\};':"\\|<>\/?]/g);
  if (symbolMatch && symbolMatch.length > 5 && symbolMatch.length > text.length * 0.3) {
    return true;
  }
  
  // Specific garbage patterns seen in the screenshots
  if (/C\s*3D3\//.test(text)) return true;
  if (/6\?\s*#\$/.test(text)) return true;
  
  return false;
}

// Function to fix specific known OCR/PDF extraction errors
function fixText(text) {
  let fixed = text;
  
  // Fix specific words
  fixed = fixed.replace(/KÖ\s*ù\s*ESİNDE/g, "KÖŞESİNDE");
  fixed = fixed.replace(/JİLETÇİKADiR/gi, "JİLETÇİ KADİR");
  fixed = fixed.replace(/Foto Ö Raflarla Hap Ø Shane Hayati\.\.\./gi, "Fotoğraflarla Hapishane Hayatı...");
  fixed = fixed.replace(/Foto Ö Raflarla/gi, "Fotoğraflarla");
  fixed = fixed.replace(/Hap Ø Shane/gi, "Hapishane");
  
  // Fix uppercase variants of specific letters if any
  fixed = fixed.replace(/ù /g, "ş ");
  fixed = fixed.replace(/ ù /g, " ş ");
  
  return fixed;
}

let removedCount = 0;
let fixedCount = 0;

if (data.book3 && data.book3.chapters) {
  data.book3.chapters.forEach(chapter => {
    // Fix chapter title
    chapter.title = fixText(chapter.title);
    
    // Filter and fix paragraphs
    const newParagraphs = [];
    for (let p of chapter.paragraphs) {
      if (p.type === 'paragraph') {
        const originalText = p.text;
        
        // Remove garbage completely
        if (isGarbage(originalText)) {
          removedCount++;
          continue;
        }
        
        const newText = fixText(originalText);
        if (newText !== originalText) {
          fixedCount++;
        }
        
        p.text = newText;
        newParagraphs.push(p);
      } else {
        newParagraphs.push(p); // Keep other types like image
      }
    }
    chapter.paragraphs = newParagraphs;
  });
}

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

console.log(`Cleaned DGM 163 book text.`);
console.log(`Removed ${removedCount} garbage paragraphs.`);
console.log(`Fixed ${fixedCount} paragraphs.`);
