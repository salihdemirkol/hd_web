const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/efendilik_content.json');
const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// Common spacing fixes
const specificFixes = [
  // Uppercase merged words
  [/YENiTERÖR/g, "YENİ TERÖR"],
  [/GiDiYORUM/g, "GİDİYORUM"],
  [/SiZEİNSAN/g, "SİZE İNSAN"],
  [/IKİNCiGÜN/g, "İKİNCİ GÜN"],
  [/CEZADAİKİNCiDURU/g, "CEZADA İKİNCİ DURUŞMA"],
  [/DAHAiYiBAKIYORLAR/g, "DAHA İYİ BAKIYORLAR"],
  [/ÇAYiÇİLiR/g, "ÇAY İÇİLİR"],
  [/GEDİKLİSiOLMAYA/g, "GEDİKLİSİ OLMAYA"],
  [/GERÇEKLERiBİLE/g, "GERÇEKLERİ BİLE"],
  [/SUiÇMEK/g, "SU İÇMEK"],
  [/GiTMEKİSTiYORUM/g, "GİTMEK İSTİYORUM"],
  [/MİLLiGÖRÜ/g, "MİLLİ GÖRÜŞ"],
  [/ELBİSEMiÇIKARAMAZSINIZ/g, "ELBİSEMİ ÇIKARAMAZSINIZ"],
  [/ZİNDANDAİKİNCiRAMAZAN/g, "ZİNDANDA İKİNCİ RAMAZAN"],
  [/IMİSLAMiHAREKET/g, "İSLAMİ HAREKET"],
  [/DELİLiOLUR/g, "DELİLİ OLUR"],
  [/YENiBİR/g, "YENİ BİR"],
  [/CEZAEVİNÖBETÇiASTSUBAYIYLA/g, "CEZAEVİ NÖBETÇİ ASTSUBAYIYLA"],
  [/IRTiCAiFAALiYETLER/g, "İRTİCAİ FAALİYETLER"],
  [/IRTiCAiUNSURLAR/g, "İRTİCAİ UNSURLAR"],
  [/MAHKEMESiBA/g, "MAHKEMESİ BAŞ"],
  [/DİKENLiYOLDA/g, "DİKENLİ YOLDA"],
  [/HiLALİSTİKLALİN/g, "HİLAL İSTİKLALİN"],
  [/ÖRTÜNMEYiEMREDERKEN/g, "ÖRTÜNMEYİ EMREDERKEN"],
  [/DEVLETiNİKURUNCAİSL/g, "DEVLETİNİ KURUNCA İSL"],
  [/CiHADIMIZİSLAM/g, "CİHADIMIZ İSLAM"],
  [/DEVLETiiÇİN/g, "DEVLETİ İÇİN"],
  [/GEÇERLiOLMADI/g, "GEÇERLİ OLMADI"],
  [/İSLAMiDEVLETİSTiYORUZ/g, "İSLAMİ DEVLET İSTİYORUZ"],
  [/MAHKEMESiCUMHURiYET/g, "MAHKEMESİ CUMHURİYET"],
  [/IKiÖNEMLiHUSUSU/g, "İKİ ÖNEMLİ HUSUSU"],
  [/KAYETiÜZERİNE/g, "ŞİKAYETİ ÜZERİNE"],
  [/GÖREBİLiR/g, "GÖREBİLİR"],
  [/MiYiZ/g, "MİYİZ"],
  
  // Mixed case merged words
  [/Zindandakikurallar/g, "Zindandaki kurallar"],
  [/Fişigetiren/g, "Fişi getiren"],
  [/Bizigör/g, "Bizi gör"],
  [/SiYASiş/g, "Siyasi ş"],
  [/Siyasişubede/g, "Siyasi şubede"],
  [/Siyasişubeden/g, "Siyasi şubeden"],
  [/Siyasişubeye/g, "Siyasi şubeye"],
  [/Bizizora/g, "Bizi zora"],
  [/Biziatlatma/g, "Bizi atlatma"],
  [/Siziezerler/g, "Sizi ezerler"],
  [/Ziyaretçikartını/g, "Ziyaretçi kartını"],
  [/Birbirimiziteselliettik/g, "Birbirimizi teselli ettik"],
  [/Ziyaretçisiolanların/g, "Ziyaretçisi olanların"],
  [/Dincilerle/g, "Dincilerle"],
  [/Bizimerak/g, "Bizi merak"],
  [/Diniçin/g, "Din için"],
  [/Birisigeldi/g, "Birisi geldi"],
  [/Bizidört/g, "Bizi dört"],
  [/Birisiihtiyaç/g, "Birisi ihtiyaç"],
  [/Bizitekrar/g, "Bizi tekrar"],
  [/Kimsesizlerikoruyacağım/g, "Kimsesizleri koruyacağım"],
  [/Birincimahkemem/g, "Birinci mahkemem"],
  [/Bileklerimizisıkış/g, "Bileklerimizi sıkış"],
  [/Bizidüşünme/g, "Bizi düşünme"],
  [/Kitapşöyle/g, "Kitap şöyle"],
  [/Birbirimizin/g, "Birbirimizin"],
  [/Bizibunlar/g, "Bizi bunlar"],
  [/Bizinananlar/g, "Bizi inananlar"],
  [/Diyanetiş/g, "Diyanet iş"],
  [/Nihayetşubeye/g, "Nihayet şubeye"],
  [/Biridayak/g, "Biri dayak"],
  [/Zindandaısınacak/g, "Zindanda ısınacak"],
  [/Diyanetimamı/g, "Diyanet imamı"],
  [/Zindanidaresiaklını/g, "Zindan idaresi aklını"],
  [/Biziayırdılar/g, "Bizi ayırdılar"],
  [/Bizimiçin/g, "Bizim için"],
  [/Birileribunlara/g, "Birileri bunlara"],
  [/Bizinanan/g, "Bizi inanan"],
  [/Siziuyurken/g, "Sizi uyurken"],
  [/MilligörüşTeşkilatı/g, "Milli Görüş Teşkilatı"],
  [/Milligörüş/g, "Milli Görüş"],
  [/Zinacılar/g, "Zinacılar"],
  [/Birinsan/g, "Bir insan"],
  [/Birgün/g, "Bir gün"],
  [/Cinayetiş/g, "Cinayet iş"],
  [/Dinişiikinciplanda/g, "Din işi ikinci planda"],
  [/Zindandakiinsanın/g, "Zindandaki insanın"],
  [/MilligörüşTeşkilatının/g, "Milli Görüş Teşkilatı'nın"],
  [/Bizimisyanımız/g, "Bizim isyanımız"],
  [/Ziyaretçisioluyor/g, "Ziyaretçisi oluyor"],
  [/BirliğiKurucularışunlar/g, "Birliği Kurucuları şunlar"],
  [/Bilindiğigibisiyonizm/g, "Bilindiği gibi siyonizm"],
  [/BilindiğigibiBatı/g, "Bilindiği gibi Batı"],
  [/Filistinliayrıca/g, "Filistinli ayrıca"],
  [/Bilhassaisl/g, "Bilhassa İsl"],
  [/SiirtliZeki/g, "Siirtli Zeki"],
  [/Birincisibu/g, "Birincisi bu"],
  [/Bizibıraktın/g, "Bizi bıraktın"],
  [/Birisigırtlağını/g, "Birisi gırtlağını"],
  [/Birisiahirete/g, "Birisi ahirete"],
  [/Sizidinleyebilmekiçiniçimde/g, "Sizi dinleyebilmek için içimde"],
  [/BirincisiSiyonistlerin/g, "Birincisi Siyonistlerin"],
  [/Mitingiolarak/g, "Mitingi olarak"],
  [/Nitekimirticaiunsurlar/g, "Nitekim irticai unsurlar"],
  [/Birliğiadlarıile/g, "Birliği adları ile"],
  [/Hicretisimli/g, "Hicret isimli"],
  [/Hicretisimliyayında/g, "Hicret isimli yayında"],
  [/FERLAGSisimligazete/g, "FERLAGS isimli gazete"],
  [/DEVLETikurmayı/g, "DEVLETİ kurmayı"],
  [/Bizisl/g, "Bizi İsl"],
  [/Milligörüşkuruluşlarının/g, "Milli Görüş kuruluşlarının"],
  [/Birliğiadı/g, "Birliği adı"],
  [/Birliğiidare/g, "Birliği idare"],
  [/Dizipusulasına/g, "Dizi pusulasına"],
  [/BirliğiDerneği/g, "Birliği Derneği"],
  [/BirliğiHeyeti/g, "Birliği Heyeti"],
  [/Bizibazı/g, "Bizi bazı"],
  [/Sizlerisıkmadan/g, "Sizleri sıkmadan"],
  [/Kimisisolaklaşıyor/g, "Kimisi solaklaşıyor"],
  [/MilliGazete/g, "Milli Gazete"],
  [/MilletvekiliGenel/g, "Milletvekili Genel"],
  [/Milligörüşdavasına/g, "Milli Görüş davasına"],
  [/MilliGençlik/g, "Milli Gençlik"],
  [/Sizibanttan/g, "Sizi banttan"],
  [/MilletvekiliMurat/g, "Milletvekili Murat"],
  [/Birbiriniçok/g, "Birbirini çok"],

  // Uppercase to lowercase missing spaces like "geldiAhmet"
  // Handled by generic regex later
];

// Generic regex replacements
const regexFixes = [
  // Insert space between lowercase and uppercase, unless it's GmbH
  {
    regex: /(?<![Gg]m)([a-zçğıöşü])([A-ZÇĞİÖŞÜ])/g,
    replace: '$1 $2'
  },
  // Insert space after comma, semicolon, question mark or exclamation mark if followed by a letter
  {
    regex: /([,;!?])([A-Za-zÇĞİÖŞÜçğıöşü])/g,
    replace: '$1 $2'
  },
  // Insert space after period if followed by Uppercase letter, avoiding abbreviations like T.C. or Prof.Dr.
  {
    regex: /(?<!\b[A-ZÇĞİÖŞÜ])(?<!\b[A-ZÇĞİÖŞÜ]\.)(\.)([A-ZÇĞİÖŞÜ])/g,
    replace: '$1 $2'
  },
  // Uppercase words containing lowercase 'i' -> Convert to uppercase 'İ'
  {
    regex: /\b([A-ZÇĞİÖŞÜ]+i[A-ZÇĞİÖŞÜi]*)\b/g,
    replace: (match) => match.replace(/i/g, 'İ')
  }
];

let fixedCount = 0;

function applyFixes(text) {
  let newText = text;
  
  // Specific fixes
  for (const [pattern, replacement] of specificFixes) {
    newText = newText.replace(pattern, replacement);
  }
  
  // Generic fixes
  for (const fix of regexFixes) {
    if (typeof fix.replace === 'function') {
      newText = newText.replace(fix.regex, fix.replace);
    } else {
      newText = newText.replace(fix.regex, fix.replace);
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

console.log(`Fixed missing spaces and capitalization in ${fixedCount} locations.`);
