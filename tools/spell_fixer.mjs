import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nspell from 'nspell';
import dictionaryTr from 'dictionary-tr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../data/efendilik_content.json');
const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const spell = nspell(dictionaryTr);

let fixedCount = 0;
let checkedCount = 0;

function fixWord(word) {
  // If it's correctly spelled, do nothing
  if (spell.correct(word)) return word;

  const len = word.length;
  if (len < 6) return word;

  // Try to find a valid 2-word split
  // Prioritize splits where both parts are valid words
  for (let i = 3; i <= len - 3; i++) {
    const p1 = word.slice(0, i);
    const p2 = word.slice(i);
    
    // In Turkish, the second word might need capitalization if the original was capitalized
    // but typically it's two lowercase words fused, or TitleCase merged.
    // e.g. Mahkemesisorgu -> Mahkemesi sorgu
    
    // We check both parts. We lower case the second part if the first was capitalized?
    // Let's just check the exact strings first.
    if (spell.correct(p1) && spell.correct(p2)) {
      // Valid split found!
      return p1 + ' ' + p2;
    }
    
    // If original was "Mahkemesisorgu", p2="sorgu" (lowercase). Correct.
    // If original was "MilliGazete", p1="Milli", p2="Gazete" (Capitalized). Correct.
    // What if p2 is lowercase in original but should be lowercase? "mavigökkubbe"
  }
  
  // Try to find a valid 3-word split for things like mavigökkubbe -> mavi gök kubbe
  for (let i = 3; i <= len - 6; i++) {
    for (let j = i + 3; j <= len - 3; j++) {
      const p1 = word.slice(0, i);
      const p2 = word.slice(i, j);
      const p3 = word.slice(j);
      
      if (spell.correct(p1) && spell.correct(p2) && spell.correct(p3)) {
        return p1 + ' ' + p2 + ' ' + p3;
      }
    }
  }

  return word;
}

function applyFixes(text) {
  // Regex to match Turkish words
  const wordRegex = /([A-ZÇĞİÖŞÜa-zçğıöşü]{6,})/g;
  
  let newText = text.replace(wordRegex, (match) => {
    checkedCount++;
    const fixed = fixWord(match);
    if (fixed !== match) {
      fixedCount++;
      // console.log(`${match} -> ${fixed}`);
    }
    return fixed;
  });

  return newText;
}

Object.values(data).forEach(book => {
  if (book.chapters) {
    book.chapters.forEach(c => {
      c.title = applyFixes(c.title);
      c.paragraphs.forEach(p => {
        if (p.type === 'paragraph') {
          p.text = applyFixes(p.text);
        }
      });
    });
  }
});

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

console.log(`Checked ${checkedCount} words. Fixed ${fixedCount} merged words.`);
