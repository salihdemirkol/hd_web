import fitz
import json
import os
import re

PDF_PATH = r"E:\GRAFIK\TALIH\HASAN DAMAR KİTAPLAR\HASAN DAMAR 2026\BASILAN\DGM\hasan damar DGM++.pdf"
# Note: The Turkish I with dot in KİTAPLAR is \u004b\u0049\u0307\u0054\u0041\u0050\u004c\u0041\u0052
# But let's check what os.listdir says. We will use a safe path search.

def find_pdf():
    base_dir = r"E:\GRAFIK\TALIH"
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if "hasan damar DGM++.pdf" in file and not file.startswith("._"):
                return os.path.join(root, file)
    return None

def clean_text(text):
    if not text:
        return ""
    # Remove excessive newlines inside paragraphs
    text = re.sub(r'([a-zğüşöçIİ])-\n([a-zğüşöç])', r'\1\2', text, flags=re.IGNORECASE) # Fix hyphenation
    text = re.sub(r'(?<!\n)\n(?!\n)', ' ', text) # Replace single newlines with space
    text = re.sub(r'\s+', ' ', text) # Compress multiple spaces
    return text.strip()

def parse_pdf():
    pdf_path = find_pdf()
    if not pdf_path:
        print("PDF not found!")
        return

    print("Reading PDF...")
    doc = fitz.open(pdf_path)
    
    book = {
        "id": "book3",
        "title": "DGM 163",
        "subtitle": "Tarihi Savunma",
        "chapters": []
    }
    
    current_chapter = None
    chapter_counter = 1
    
    image_list = []
    
    img_dir = os.path.join(os.getcwd(), 'public', 'upload', 'galeri', 'dgm')
    os.makedirs(img_dir, exist_ok=True)
    img_counter = 1

    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # Extract images
        images = page.get_images(full=True)
        for img_info in images:
            xref = img_info[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            img_filename = f"dgm_image_{img_counter}.{image_ext}"
            img_path = os.path.join(img_dir, img_filename)
            with open(img_path, "wb") as f:
                f.write(image_bytes)
            
            image_list.append({
                "id": f"dgm_img_{img_counter}",
                "url": f"/upload/galeri/dgm/{img_filename}",
                "title": f"DGM 163 - Görsel {img_counter}",
                "type": "photo"
            })
            img_counter += 1

        # Extract text blocks
        blocks = page.get_text("dict")["blocks"]
        for block in blocks:
            if "lines" in block:
                # Determine block properties
                block_text = ""
                is_heading = False
                max_size = 0
                is_bold = False
                
                for line in block["lines"]:
                    for span in line["spans"]:
                        text = span["text"].strip()
                        if text:
                            block_text += text + " "
                            if span["size"] > max_size:
                                max_size = span["size"]
                            # Basic heuristic for bold
                            if "bold" in span["font"].lower() or "black" in span["font"].lower():
                                is_bold = True
                
                block_text = clean_text(block_text)
                if not block_text:
                    continue
                
                # Heuristic for Headings: larger font size or short bold text
                if max_size > 14 or (is_bold and len(block_text) < 80 and block_text.isupper()):
                    is_heading = True
                
                # Often page numbers are isolated numbers
                if block_text.isdigit() and len(block_text) < 4:
                    continue

                if is_heading:
                    if current_chapter:
                        book["chapters"].append(current_chapter)
                    
                    current_chapter = {
                        "id": f"c3_{chapter_counter}",
                        "title": block_text.title(),
                        "paragraphs": []
                    }
                    chapter_counter += 1
                else:
                    if not current_chapter:
                        current_chapter = {
                            "id": f"c3_{chapter_counter}",
                            "title": "GİRİŞ",
                            "paragraphs": []
                        }
                        chapter_counter += 1
                    
                    current_chapter["paragraphs"].append({
                        "type": "paragraph",
                        "text": block_text
                    })
    
    if current_chapter:
        book["chapters"].append(current_chapter)
        
    output_data = {
        "book": book,
        "images": image_list
    }
    
    with open("dgm_extracted.json", "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
        
    print("Extraction complete. Data saved to dgm_extracted.json")

if __name__ == "__main__":
    parse_pdf()
