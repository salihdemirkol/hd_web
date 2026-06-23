const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/efendilik_content.json');
const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const exactReplacements = {
  "TELEVİ ZYON": "TELEVİZYON",
  "KOĞUŞTAMİ RATI": "KOĞUŞ TAMİRATI",
  "ORGANİ ZASYONU": "ORGANİZASYONU",
  "Nİ YE": "NİYE",
  "IRTİ CA": "İRTİCA",
  "RTİ CA": "İRTİCA",
  "CUMHURİ YET": "CUMHURİYET",
  "ISPİ YONCUİMAM": "İSPİYONCU İMAM",
  "EDİ YOR": "EDİYOR",
  "BAŞLATTIĞİSLAMİ HAREKET": "BAŞLATTIĞI İSLAMİ HAREKET",
  "CEMİ YETİKURUCULARI": "CEMİYETİ KURUCULARI",
  "MESCİ DİNEİMAM": "MESCİDİNE İMAM",
  "MEVLİ THAN": "MEVLİTHAN",
  "TAHLİ YEM": "TAHLİYEM",
  "Nİ HAYET": "NİHAYET",
  "MÜCAHİ DE": "MÜCAHİDE",
  "IRTİ CANIN": "İRTİCANIN",
  "Dİ YE": "DİYE",
  "HÜRRİ YET": "HÜRRİYET",
  "ITİ RAF": "İTİRAF",
  "NETİ CE": "NETİCE",
  "DDİ ANAME": "İDDİANAME",
  "IDDİ ANAME": "İDDİANAME",
  "Gİ DEN": "GİDEN",
  "Cİ HAD": "CİHAD",
  "HALİ FE": "HALİFE",
  "Hİ CRET": "HİCRET",
  "ABİ DİN": "ABİDİN",
  "EREFŞEREFLİ DEN": "ŞEREFLİDEN",
  "MAHKEMESİ BAŞŞKANLIĞI": "MAHKEMESİ BAŞKANLIĞI",
  "KİNCİ DURUŞMAŞMA": "İKİNCİ DURUŞMA",
  "KİNCİ RAMAZAN": "İKİNCİ RAMAZAN",
  "KİNCİ GÜN": "İKİNCİ GÜN",
  "KİNCİ GİDİŞİMİZ": "İKİNCİ GİDİŞİMİZ",
  "KİNCİ VE": "İKİNCİ VE",
  "KİNCİ HEYETİN": "İKİNCİ HEYETİN",
  "CEZAEVİ YLE": "CEZAEVİYLE",
  "Kİ ÖNEML": "İKİ ÖNEMLİ",
  "MDİ BASIN": "M. DİBASIN",
  "KUVVETLERİİ LE": "KUVVETLERİ İLE",
  "DERNEKLERİ FEDERASYONU": "DERNEKLERİ FEDERASYONU",
  "MUSEVİ HÜKÜMRANLIĞI": "MUSEVİ HÜKÜMRANLIĞI",
  "SLAMİ HASSASİYETLERİN": "İSLAMİ HASSASİYETLERİN",
  "SLAMİ DEVLET": "İSLAMİ DEVLET",
  "RTÜNMEYİ EMREDERKEN": "ÖRTÜNMEYİ EMREDERKEN"
};

let fixedCount = 0;

function applyFixes(text) {
  let newText = text;
  
  for (const [oldStr, newStr] of Object.entries(exactReplacements)) {
    if (newText.includes(oldStr)) {
      newText = newText.split(oldStr).join(newStr);
    }
  }

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

console.log(`Applied pass 3 fixes in ${fixedCount} locations.`);
