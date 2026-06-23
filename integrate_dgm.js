const fs = require('fs');
const path = require('path');

function cleanText(text) {
    if (!text) return text;
    // Remove paragraphs that are mostly garbage (too many symbols)
    const symbols = text.match(/[^a-zA-ZğüşöçIİĞÜŞÖÇ0-9\s.,?!;:()'"-]/g);
    if (symbols && symbols.length > text.length * 0.3) {
        return ""; // Too much garbage
    }
    
    // Fix common spacing around Turkish characters
    let t = text;
    t = t.replace(/ i /g, 'i');
    t = t.replace(/ ş /g, 'ş');
    t = t.replace(/ ğ /g, 'ğ');
    t = t.replace(/ ı /g, 'ı');
    t = t.replace(/ i/g, 'i');
    t = t.replace(/ ş/g, 'ş');
    t = t.replace(/ ğ/g, 'ğ');
    t = t.replace(/ ı/g, 'ı');
    t = t.replace(/i /g, 'i');
    
    // Fix known broken words
    t = t.replace(/HAPİSHANE HAYATINI MERAK EDENLERİÇİN BİR MAHKUMUN GÜNCES i/gi, 'HAPİSHANE HAYATINI MERAK EDENLER İÇİN BİR MAHKUMUN GÜNCESİ');
    t = t.replace(/iş te/gi, 'işte');
    t = t.replace(/olduğ umuz/gi, 'olduğumuz');
    t = t.replace(/olduğ unu/gi, 'olduğunu');
    t = t.replace(/baş ladı/gi, 'başladı');
    t = t.replace(/kesiş ti/gi, 'kesişti');
    t = t.replace(/ışığ a/gi, 'ışığa');
    t = t.replace(/ş eyler/gi, 'şeyler');
    t = t.replace(/yapmış tır/gi, 'yapmıştır');
    t = t.replace(/değ ildir/gi, 'değildir');
    t = t.replace(/hoş gör/gi, 'hoşgör');
    t = t.replace(/baş lık/gi, 'başlık');
    t = t.replace(/kiş iler/gi, 'kişiler');
    t = t.replace(/davranış lar/gi, 'davranışlar');
    t = t.replace(/verilmiş tir/gi, 'verilmiştir');
    t = t.replace(/düş ün/gi, 'düşün');
    t = t.replace(/anla şıl/gi, 'anlaşıl');
    t = t.replace(/bıkmış/gi, 'bıkmış');
    t = t.replace(/iş çi/gi, 'işçi');
    t = t.replace(/teş kilat/gi, 'teşkilat');
    t = t.replace(/sağ ladı/gi, 'sağladı');
    t = t.replace(/ateş li/gi, 'ateşli');
    t = t.replace(/konuş ma/gi, 'konuşma');
    t = t.replace(/geliş me/gi, 'gelişme');
    t = t.replace(/görüş/gi, 'görüş');
    t = t.replace(/i k/g, 'İk');
    t = t.replace(/i l/g, 'İl');
    t = t.replace(/i m/g, 'İm');
    t = t.replace(/i n/g, 'İn');
    t = t.replace(/i s/g, 'İs');
    t = t.replace(/i ş/g, 'İş');
    
    // Capitalize first letters properly if broken
    t = t.replace(/ i(\w)/g, ' I$1');
    t = t.replace(/^i(\w)/g, 'I$1');
    
    t = t.replace(/\s+/g, ' ');
    return t.trim();
}

function integrate() {
    console.log("Loading DGM fixed JSON...");
    const dgmData = JSON.parse(fs.readFileSync('dgm_fixed.json', 'utf8'));
    const dgmBook = dgmData.book;
    const dgmImages = dgmData.images || [];

    // Clean DGM Book content
    console.log("Cleaning text...");
    const cleanedChapters = [];
    for (const chapter of dgmBook.chapters) {
        let title = cleanText(chapter.title);
        // If title is garbage, try to extract a generic title or drop if no content
        if (!title && chapter.paragraphs.length > 0) {
            title = "Bölüm";
        }
        
        const cleanedParagraphs = [];
        for (const p of chapter.paragraphs) {
            const txt = cleanText(p.text);
            if (txt && txt.length > 5) {
                cleanedParagraphs.push({ type: 'paragraph', text: txt });
            }
        }
        
        if (cleanedParagraphs.length > 0) {
            cleanedChapters.push({
                id: chapter.id,
                title: title,
                paragraphs: cleanedParagraphs
            });
        }
    }
    dgmBook.chapters = cleanedChapters;

    // Load Efendilik
    console.log("Loading efendilik_content.json...");
    const efPath = path.join(__dirname, 'data', 'efendilik_content.json');
    const efData = JSON.parse(fs.readFileSync(efPath, 'utf8'));
    
    // Add DGM
    efData['book3'] = dgmBook;
    
    fs.writeFileSync(efPath, JSON.stringify(efData, null, 2));
    console.log("Added DGM 163 to efendilik_content.json.");

    // Load DB
    console.log("Loading db.json...");
    const dbPath = path.join(__dirname, 'data', 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    if (!dbData.gallery) {
        dbData.gallery = [];
    }
    
    // Add new images to gallery
    // Filter out very small images or duplicates if possible, or just add all
    for (const img of dgmImages) {
        // Just add them at the top or bottom
        dbData.gallery.unshift(img);
    }
    
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    console.log(`Added ${dgmImages.length} images to db.json gallery.`);
}

integrate();
