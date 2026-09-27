# Hasan Damar Web Projesi (Next.js Bento UI) — TEMEL KURAL

## ⚠️ KRİTİK UYARI (YAŞANAN GEÇMİŞ HATA)
Geçmişte `efendilikten-koleliğe` (statik HTML) klasöründeki kodlar yanlışlıkla asıl Next.js reposuna (hd_web) force push edilerek canlı sitenin çökmesine / eski sitenin yayına girmesine sebep olunmuştur. **Bu hatayı ASLA TEKRARLAMA.**

- **ASIL ÇALIŞMA DİZİNİ BURASIDIR:** `C:\Users\demir\.gemini\antigravity-ide\scratch\hasan-damar-web\`
- **MİMARİ:** Bu proje Next.js (App Router), Tailwind CSS ve Bento UI ızgara tasarımı kullanır. Statik HTML DEĞİLDİR.
- **DİĞER KLASÖRLER (Örn: efendilikten-koleliğe):** Bu klasördeki kodlar eski/veri amaçlıdır. Asla Vercel/GitHub'a `hd_web` reposu üzerine push edilmeyecektir.

## Proje Kimliği ve Ortam

- Kullanıcı: **Salih Demirkol** (@salihdemirkol)
- GitHub Repo: **https://github.com/salihdemirkol/hd_web** (Sadece `hasan-damar-web` içinden buraya push yapılabilir)
- Vercel URL: **https://hd-web-zeta.vercel.app/**
- Çalıştırma: `npm run dev` (Port 3000)

## Geliştirme Kuralı
1. Tüm UI güncellemeleri Bento Grid tasarımına sadık kalarak, modern, Tailwind kullanarak yapılacaktır.
2. Vercel her zaman Next.js (`npm run build`) olarak deploy almalıdır.
3. Git işlemleri sadece `hasan-damar-web` dizininde yapılacaktır.
