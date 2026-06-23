const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/efendilik_content.json');
const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const exactReplacements = {
  "Damarisimlihükümlü": "Damar isimli hükümlü",
  "Neredeyseisyan": "Neredeyse isyan",
  "beninezarete": "beni nezarete",
  "ş ehmus": "Şehmus",
  "iş KENCE MÎ": "İŞKENCE Mİ",
  "iş KENCE M": "İŞKENCE M",
  "iş kence": "işkence",
  "İş kence": "İşkence",
  "iş kenceden": "işkenceden",
  "iş KENCE": "İŞKENCE",
  "ùi MDİSIRA BENDE": "ŞİMDİ SIRA BENDE",
  "ANAR ùi": "ANARŞİ",
  "Bahaddin ùi MŞEK": "Bahaddin ŞİMŞEK",
  "DİN GÖREVLİSİNİN ùi ŞİKAYETİ": "DİN GÖREVLİSİNİN ŞİKAYETİ",
  "ùimdi": "Şimdi",
  "ùimdiiyiyim": "Şimdi iyiyim",
  "ùimdisenicezalandıracağız": "Şimdi seni cezalandıracağız",
  "ùimdikoğuşumda": "Şimdi koğuşumda",
  "ùimdio": "Şimdi o",
  "ùimdibu": "Şimdi bu",
  "ùimdiyahudilerin": "Şimdi yahudilerin",
  "ùimdisağ": "Şimdi sağ",
  "ùimdihepimiz": "Şimdi hepimiz",
  "ùimdibazı": "Şimdi bazı",
  "ùimdimuhterem": "Şimdi muhterem",
  "ùimdisabretmem": "Şimdi sabretmem",
  "ùimdiise": "Şimdi ise",
  "ù": "ş",
  "ùi": "şi"
};

let fixedCount = 0;

function applyFixes(text) {
  let newText = text;
  
  // Specific replacements
  for (const [oldStr, newStr] of Object.entries(exactReplacements)) {
    if (newText.includes(oldStr)) {
      newText = newText.split(oldStr).join(newStr);
    }
  }

  // Generic patterns observed in user reports and database check:
  // "iş KENCE MÎ?.. YOK CANIM!.." -> "İŞKENCE Mİ?.. YOK CANIM!.."
  newText = newText.replace(/iş\sKENCE\sMÎ/g, 'İŞKENCE Mİ');
  newText = newText.replace(/iş\sKENCE/g, 'İŞKENCE');
  newText = newText.replace(/ş\sehmus/g, 'Şehmus');
  newText = newText.replace(/Ş\sehmus/g, 'Şehmus');
  
  // Also any remaining "ù"
  newText = newText.replace(/ù/g, 'ş');

  if (newText !== text) {
    fixedCount++;
  }
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

console.log(`Applied pass 4 fixes in ${fixedCount} locations.`);
