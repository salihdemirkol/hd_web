import json
import re

def fix_text(text):
    if not text:
        return text
    
    # Character mapping based on PDF font bugs
    # 'ø' -> 'i' / 'İ'
    # 'ú' -> 'ş' / 'Ş'
    # '÷' -> 'ğ' / 'Ğ'
    # '\u0002' -> 'ı' / 'I'
    
    text = text.replace(' ø ', 'i')
    text = text.replace('ø', 'i')
    text = text.replace(' ú ', 'ş')
    text = text.replace('ú', 'ş')
    text = text.replace(' ÷ ', 'ğ')
    text = text.replace('÷', 'ğ')
    text = text.replace(' \u0002', 'ı')
    text = text.replace('\u0002', 'ı')
    
    # Remove any remaining control characters (except newline if any)
    text = re.sub(r'[\u0000-\u0008\u000b-\u001f\u007f-\u009f]', '', text)
    
    # Fix uppercase/lowercase context later if needed, but 'i' instead of 'İ' in "HAPiSHANE" is acceptable or can be fixed by title() / upper() rules.
    # We can fix specific words:
    text = text.replace('HAPiSHANE', 'HAPİSHANE')
    text = text.replace('iÇiN', 'İÇİN')
    text = text.replace('BiR', 'BİR')
    text = text.replace('iL', 'İL')
    text = text.replace('iS', 'İS')
    text = text.replace('iM', 'İM')
    text = text.replace('iN', 'İN')
    text = text.replace('iK', 'İK')
    
    # Fix spacing issues
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def fix_json():
    with open("dgm_extracted.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    book = data.get("book", {})
    new_chapters = []
    
    for chapter in book.get("chapters", []):
        new_chapter = {
            "id": chapter["id"],
            "title": fix_text(chapter.get("title", "")),
            "paragraphs": []
        }
        
        for p in chapter.get("paragraphs", []):
            fixed_p = fix_text(p.get("text", ""))
            # Ignore empty or very short garbage paragraphs
            if fixed_p and len(fixed_p) > 2:
                new_chapter["paragraphs"].append({
                    "type": "paragraph",
                    "text": fixed_p
                })
        
        if new_chapter["paragraphs"] or new_chapter["title"]:
            new_chapters.append(new_chapter)
            
    book["chapters"] = new_chapters
    data["book"] = book
    
    with open("dgm_fixed.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    fix_json()
    print("Fixed JSON saved to dgm_fixed.json")
