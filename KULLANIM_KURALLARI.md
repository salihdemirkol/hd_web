# Proje Kullanım ve Yönetim Kuralları

Bu dosya, projede çalışan asistanların (benim) her zaman uyması gereken temel kuralları içerir. Yapılacak her işlem öncesi bu kurallarla çelişen bir durum olup olmadığı kontrol edilecek, çelişen bir istek gelirse kullanıcı mutlaka önceden bilgilendirilecektir.

## 1. Klasör Düzeni ve Temizlik (Sunucuya Yükleme Kriterleri)
* **Atık ve Geçici Dosyalar (`/tools` klasörü):** Projenin çalışması için hiçbir şekilde gerekmeyen, veri çekmek vb. geçici testler için yazılmış betikler (ör. `fetch.js`), şifre dosyaları ve geçici notlar ana dizinde barındırılamaz. Bunların tamamı anında `/tools` klasörü içine taşınmalıdır.
* **Gereksiz ama Zararsız Dosyalar (`/gereksiz` klasörü):** Sunucuya yüklenmesi zorunlu olmayan ancak silinmemesi istenen dosyalar `/gereksiz` klasöründe düzenli bir şekilde tutulmalıdır.
* **Kök Dizin (Root) Temizliği:** Proje kök dizininde ve `src/`, `public/` gibi ana kaynak klasörlerinde hiçbir atık, test script'i veya sahipsiz dosya kalmamalıdır. Proje her an sunucuya (production) atılacakmış gibi tertemiz ve profesyonel bir düzende bırakılmalıdır.

## 2. Çalışma Prensibi
Bu kurallar her sorguda göz önünde bulundurulacak. Eğer kullanıcının talebi, projenin temizliğini bozacak veya kök dizine geçici/çöp bir dosya koymayı gerektirecek bir durum içeriyorsa, bu dosyalar derhal doğrudan `/tools` veya `/gereksiz` klasöründe oluşturulacaktır.

## 3. Çok Dilli Çeviri (Google Translate) Kuralları
* **Orijinal İçeriğin Korunması:** Sitede özellikle Arapça olarak yazılmış orijinal içerikler (örneğin ayet, hadis veya orijinal başlıklar) ve marka/logo gibi bozulmaması gereken metinler HER ZAMAN orijinal haliyle (Arapça vb.) kalmalıdır.
* **Koruma Yöntemi:** Bu tür içerikleri Google Translate'in otomatik çevirisinden korumak için ilgili HTML etiketine mutlaka `className="notranslate"` veya `translate="no"` niteliği eklenmelidir.
