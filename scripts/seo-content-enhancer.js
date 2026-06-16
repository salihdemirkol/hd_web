const fs = require('fs');
const path = require('path');

const keywords = [
  {
    regex: /\b(Hasan Damar)\b(?![^<]*>|[^<>]*<\/a>)/g,
    replace: '<a href="/biyografi" title="Hasan Damar Biyografisi"><strong>Hasan Damar</strong></a>',
    maxPerItem: 2
  },
  {
    regex: /\b(Milli Görüş)\b(?![^<]*>|[^<>]*<\/a>)/g,
    replace: '<a href="/makaleler" title="Milli Görüş"><strong>Milli Görüş</strong></a>',
    maxPerItem: 3
  },
  {
    regex: /\b(Avrupa Milli Görüş|IGMG)\b(?![^<]*>|[^<>]*<\/a>)/g,
    replace: '<strong>$1</strong>',
    maxPerItem: 2
  },
  {
    regex: /\b(Avrupa Türk İslam Hareketi)\b(?![^<]*>|[^<>]*<\/a>)/g,
    replace: '<em>$1</em>',
    maxPerItem: 1
  },
  {
    regex: /\b(Necmettin Erbakan|Erbakan Hoca)\b(?![^<]*>|[^<>]*<\/a>)/g,
    replace: '<strong>$1</strong>',
    maxPerItem: 2
  },
  {
    regex: /\b(Efendilikten Köleliğe)\b(?![^<]*>|[^<>]*<\/a>)/g,
    replace: '<a href="/kulliyat" title="Efendilikten Köleliğe Kitabı"><em>Efendilikten Köleliğe</em></a>',
    maxPerItem: 2
  },
  {
    regex: /\b(DGM 163)\b(?![^<]*>|[^<>]*<\/a>)/g,
    replace: '<a href="/eserler/dgm-163" title="DGM 163"><strong>DGM 163</strong></a>',
    maxPerItem: 2
  }
];

function enhanceContent(html) {
  if (!html || typeof html !== 'string') return html;

  let processedHtml = html;
  
  keywords.forEach(kw => {
    let count = 0;
    processedHtml = processedHtml.replace(kw.regex, (match, p1) => {
      if (count < kw.maxPerItem) {
        count++;
        return kw.replace.replace('$1', p1);
      }
      return match;
    });
  });

  return processedHtml;
}

function processDbJson() {
  const dbPath = path.join(__dirname, '../data/db.json');
  if (fs.existsSync(dbPath)) {
    console.log('Processing db.json...');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Backup
    fs.writeFileSync(path.join(__dirname, '../data/db.backup.json'), JSON.stringify(db));
    
    if (db.articles) {
      db.articles = db.articles.map(article => ({
        ...article,
        content: enhanceContent(article.content)
      }));
    }
    
    if (db.memories) {
      db.memories = db.memories.map(memory => ({
        ...memory,
        content: enhanceContent(memory.content)
      }));
    }
    
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log('db.json processed successfully.');
  }
}

function processEfendilikJson() {
  const efPath = path.join(__dirname, '../data/efendilik_content.json');
  if (fs.existsSync(efPath)) {
    console.log('Processing efendilik_content.json...');
    const ef = JSON.parse(fs.readFileSync(efPath, 'utf8'));
    
    // Backup
    fs.writeFileSync(path.join(__dirname, '../data/efendilik_content.backup.json'), JSON.stringify(ef));
    
    const processedEf = {};
    for (const bookKey of Object.keys(ef)) {
      const book = ef[bookKey];
      processedEf[bookKey] = {
        ...book,
        chapters: book.chapters ? book.chapters.map(chapter => ({
          ...chapter,
          paragraphs: chapter.paragraphs ? chapter.paragraphs.map(p => ({
            ...p,
            text: p.text ? enhanceContent(p.text) : p.text,
            html: p.html ? enhanceContent(p.html) : p.html
          })) : []
        })) : []
      };
    }
    
    fs.writeFileSync(efPath, JSON.stringify(processedEf, null, 2));
    console.log('efendilik_content.json processed successfully.');
  }
}

processDbJson();
processEfendilikJson();
