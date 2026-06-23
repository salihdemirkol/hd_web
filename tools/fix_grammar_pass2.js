const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/efendilik_content.json');
const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// Exact string replacements
const exactReplacements = {
  "HASAN DAMAR KİMDİ R?": "HASAN DAMAR KİMDİR?",
  "TABAKLA BİRLİKTE TARTILAN PEYNİ R": "TABAKLA BİRLİKTE TARTILAN PEYNİR",
  "Hİ Ç PARAM YOK": "HİÇ PARAM YOK",
  "KÜÇÜK O ö LUMDAN": "KÜÇÜK OĞLUMDAN",
  "O ö LU DA OLSA": "OĞLU DA OLSA",
  "163’LER A ş INDIRIR DGM SOKA ö INI": "163'LER AŞINDIRIR DGM SOKAĞINI",
  "AKGÜN A ö ABEYİKAYBETMİùi Z": "AKGÜN AĞABEYİ KAYBETMİŞİZ",
  "A ö LAMA O ö LUM A ö LAMA": "AĞLAMA OĞLUM AĞLAMA",
  "SAHİ P BULAMAYAN BE ş BİN MARK": "SAHİP BULAMAYAN BEŞ BİN MARK",
  "YANMI ş TIR": "YANMIŞTIR",
  "AVRUPA MİLLİ GÖRÜŞ ş TAKİ P ALTINDA": "AVRUPA MİLLİ GÖRÜŞ TAKİP ALTINDA",
  "CAMİİ N ş AATI Bİ TMEDEN": "CAMİİN İNŞAATI BİTMEDEN",
  "FAİLİMEÇHUL SUÇLAR GARİ PLERE YÜKLENİ R": "FAİLİ MEÇHUL SUÇLAR GARİPLERE YÜKLENİR",
  "YOKSA BURANINİÇİNE EDERİ Z": "YOKSA BURANIN İÇİNE EDERİZ",
  "TEVKİ F TARİ Hİ:": "TEVKİF TARİHİ:",
  "Sİ YONİSTLERİN U ş A ö I TURKİ YE’Lİ DİNSİ Z": "SİYONİSTLERİN UŞAĞI TÜRKİYELİ DİNSİZ",
  "YA ş AYABİLİ R": "YAŞAYABİLİR",
  "EMRİ Dİ R": "EMRİDİR",
  "SENİN ÖRTÜN BAYRA ö IMIZ": "SENİN ÖRTÜN BAYRAĞIMIZ",
  "DÜ ş MANA KAR ş I SİLAHIMIZDIR": "DÜŞMANA KARŞI SİLAHIMIZDIR",
  "Dİ NSİ Z DEVLET Gİ DECEK": "DİNSİZ DEVLET GİDECEK",
  "ş ERİ AT GELECEK VAH ş ET Bİ TECEK": "ŞERİAT GELECEK VAHŞET BİTECEK",
  "YA ş ASIN MÜSLÜMAN TÜRKİ YE MÜCADELEMİ Z": "YAŞASIN MÜSLÜMAN TÜRKİYE MÜCADELEMİZ",
  "HAYATINI KUR AN A GÖRE DÜZENLEYEN CEMAAT": "HAYATINI KUR'AN'A GÖRE DÜZENLEYEN CEMAAT",
  "HAYMANA CEZAEVİNE GELİ R GELMEZ": "HAYMANA CEZAEVİNE GELİR GELMEZ",
  "TÜRKİ YE": "TÜRKİYE",
  "Dİ NSİ Z": "DİNSİZ",
  "Gİ DECEK": "GİDECEK",
  "ş ERİ AT": "ŞERİAT",
  "Bİ TECEK": "BİTECEK",
  "MÜCADELEMİ Z": "MÜCADELEMİZ",
  "Sİ YONİSTLERİN": "SİYONİSTLERİN",
  "TEVKİ F": "TEVKİF",
  "TARİ Hİ": "TARİHİ",
  "EDERİ Z": "EDERİZ",
  "GARİ PLERE": "GARİPLERE",
  "YÜKLENİ R": "YÜKLENİR",
  "CAMİİ N": "CAMİİN",
  "Bİ TMEDEN": "BİTMEDEN",
  "TAKİ P": "TAKİP",
  "BE ş BİN": "BEŞ BİN",
  "SAHİ P": "SAHİP",
  "A ö LAMA": "AĞLAMA",
  "O ö LUM": "OĞLUM",
  "A ö ABEYİ": "AĞABEYİ",
  "KAYBETMİùi Z": "KAYBETMİŞİZ",
  "SOKA ö INI": "SOKAĞINI",
  "O ö LU": "OĞLU",
  "YANMI ş TIR": "YANMIŞTIR",
  "KİMDİ R?": "KİMDİR?",
  "PEYNİ R": "PEYNİR",
  "Hİ Ç": "HİÇ",
  "Tİ P": "TİP",
  "Mİ T": "MİT",
  "U ş A ö I": "UŞAĞI",
  "DÜ ş MANA": "DÜŞMANA",
  "KAR ş I": "KARŞI"
};

let fixedCount = 0;

function applyFixes(text) {
  let newText = text;
  
  // Apply exact replacements
  for (const [oldStr, newStr] of Object.entries(exactReplacements)) {
    // using split join to replace all occurrences globally
    if (newText.includes(oldStr)) {
      newText = newText.split(oldStr).join(newStr);
    }
  }

  // Also replace some generic OCR patterns observed:
  // uppercase letters followed by " ö " -> "Ğ"
  newText = newText.replace(/([A-ZÇİÖŞÜ])\s*ö\s*([A-ZÇİÖŞÜ])/g, '$1Ğ$2');
  newText = newText.replace(/([A-ZÇİÖŞÜ])\s*ş\s*([A-ZÇİÖŞÜ])/g, '$1Ş$2');
  newText = newText.replace(/([A-ZÇİÖŞÜ])\s*ù\s*([A-ZÇİÖŞÜ])/g, '$1Ş$2');

  // Any remaining generic detached R after İ at the end of word
  newText = newText.replace(/([A-ZÇĞİÖŞÜ]+İ)\s([RPTMNZF])\b/g, '$1$2');
  newText = newText.replace(/([A-ZÇĞİÖŞÜ]+)İ\s([Z])\b/g, '$1İZ');

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

console.log(`Applied grammar and OCR fixes in ${fixedCount} locations.`);
