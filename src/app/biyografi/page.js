export const metadata = {
  title: 'Biyografi | Hasan Damar',
  description: 'Hasan Damar\'ın hayatı, Milli Görüş hareketi içindeki yeri ve hatıraları.',
};

import styles from './page.module.css';
import Image from 'next/image';

export default function Biyografi() {
  return (
    <div className="container section">
      <div className="text-center">
        <h1 className={styles.pageTitle}>Hasan Damar Kimdir?</h1>
        <div className="divider"></div>
        <p className={styles.leadText}>
          Avrupa'daki Milli Görüş hareketinin önemli isimlerinden biri, gurbetçi kimliğinin yorulmaz savunucusu.
        </p>
      </div>

      <div className={styles.bioGrid}>
        <aside className={styles.bioSidebar}>
          <div className={`${styles.portraitCard} glass-panel`}>
            <div style={{ position: 'relative', width: '160px', height: '200px', margin: '0 auto 1rem' }}>
              <Image 
                src="/images/hasan_damar_portrait.webp" 
                alt="Hasan Damar" 
                fill
                style={{ objectFit: 'cover', borderRadius: '50%', border: '3px solid var(--color-secondary)', boxShadow: '0 8px 32px rgba(201,168,76,0.3)' }}
                sizes="160px"
              />
            </div>
            <h3 className="text-center" style={{ marginTop: '0.5rem' }}>Hasan Damar</h3>
            <p className="text-center" style={{ color: 'var(--color-text-muted-light)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Yazar · Milli Görüş Hareketi Mensubu
            </p>
            <div className={styles.tags}>
              <span className={styles.tag}>Siyasi Tarih</span>
              <span className={styles.tag}>İslami Hareket</span>
              <span className={styles.tag}>Gurbetçi Kimliği</span>
              <span className={styles.tag}>Avrupa Türkleri</span>
              <span className={styles.tag}>Milli Görüş</span>
              <span className={styles.tag}>Osmanlı Mirası</span>
            </div>
          </div>
        </aside>

        <div className={styles.bioContent}>
          <div className={styles.textCard}>
            <p className={styles.quote}>
              "Hasan Damar, Avrupa'daki Türk-İslam hareketinin en önemli tanıklarından 
              ve mimarlarından biridir. Hayatı, gurbetteki bir Müslümanın kimlik ve inanç 
              mücadelesinin belgesidir."
            </p>
          </div>

          <div className={styles.textCard}>
            <p>
              <strong>Hasan Damar</strong>, 1940 yılında Hayrabolu'nun Lahana köyünde doğdu.
              İlk mektebi köyünde bitirdikten sonra İstanbul'a geldi. Dinî tahsilini, rüştiye mezunu
              olan ve imamlık yapan babası Yaşar Hoca'dan aldı. Alpullu Şeker Fabrikasında bir
              müddet çalışttıktan sonra bir Amerikan petrol arama şirketine geçti; Tekirdağ,
              İğnecik, Şarköy ve Mürefte'de çalıştı (1960). 1961'de askerlik görevini yerine
              getirdi, 1965'te evlendi.
            </p>

            <p>
              Almanya'ya işçi olarak giden Damar, zamanla <strong>Avrupa Milli Görüş Teşkilatları</strong>'nın 
              önemli bir ismi hâline gelmiştir. Almanya, Avusturya, Fransa, Belçika, Hollanda ve 
              İsviçre'de onlarca bölge teşkilatının kuruluş ve gelişim sürecine tanıklık etmiş 
              ve bu süreçlerde aktif rol oynamıştır.
            </p>
          </div>

          <div className={styles.textCardDark}>
            <h2 style={{ marginBottom: '2.5rem', color: 'white' }}>Zaman Çizelgesi</h2>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>1930'lar</div>
                <div className={styles.timelineContent}>Hayrabolulu bir ailenin çocuğu olarak İstanbul'a geliş. Dini tahsil.</div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>1960'lar</div>
                <div className={styles.timelineContent}>Almanya'ya işçi olarak göç. Avrupa'daki Türk topluluğuyla ilk temaslar.</div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>1972</div>
                <div className={styles.timelineContent}>Milli Görüş teşkilatlanmasında aktif görev. İlk cemiyetlerin kurulması.</div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>1980'ler</div>
                <div className={styles.timelineContent}>Avrupa genelinde bölge teşkilatlarının kurulması. Bosna, Afganistan faaliyetleri.</div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>2013</div>
                <div className={styles.timelineContent}><em>Efendilikten Köleliğe</em> iki cilt hâlinde yayımlandı.</div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>2023</div>
                <div className={styles.timelineContent}>1 Haziran 2023 tarihinde vefat etti.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
