import styles from './page.module.css';
import { BookIcon, VideoIcon, CameraIcon, ArticleIcon, CalendarIcon, UsersIcon } from '../components/Icons';
import AudioBento from '@/components/AudioBento';
import { getDb } from '@/lib/db';
export const dynamic = 'force-dynamic';

export default async function Home() {
  const db = await getDb();
  const visibleAudios = (db.audios || []).filter(a => !a.hidden);
  const pinnedAudio = visibleAudios.length > 0 ? visibleAudios[0] : null;

  return (
    <div className={styles.homeWrapper}>
      
      <section className={styles.bentoSection}>
        <div className={styles.bentoGrid}>
          
          {/* HERO BENTO (2x3) */}
          <div className={`${styles.bentoItem} ${styles.bentoHero} animate-slide-up`}>
            <div className={styles.heroTextContent}>
              <h1 className={styles.heroTitle}>Hasan Damar</h1>
              <h2 className={`${styles.arabicTitle} notranslate`} dir="rtl">حسن دمار</h2>
              <p className={styles.heroSubtitle}>Milli Görüş davasına adanmış bir ömür (1940 - 2023)</p>
            </div>
            
            <div className={styles.heroImageWrapper}>
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/damar_bg-0Ieh2PImnaDjrphlEnxAZVPuOpXrHN.png" 
                alt="Hasan Damar" 
                className={styles.heroImage}
              />
            </div>
          </div>

          {/* BOOKS BENTO (2x2) */}
          <div className={`${styles.bentoItem} ${styles.bentoLarge} animate-slide-up delay-100`}>
            <div className={styles.bentoContent}>
              <div className={styles.bentoHeader}>
                <BookIcon className={styles.iconSvg} />
                <span className={styles.bentoLabel}>Külliyat</span>
              </div>
              <h3 className={styles.bentoTitle}>Kaleme Aldığı Eserler</h3>
              <p className={styles.bentoDesc}>
                Avrupa'da Milli Görüş Hareketi'nin tarihini ve "Efendilikten Köleliğe" serisini dijital ortamda okuyun.
              </p>
              
              <div className={styles.booksMiniGrid}>
                <a href="/eserler/efendilikten-kolelige-1" className={styles.miniBook}>
                  <div className={styles.miniBookCover}>
                    <img src="/images/cilt1.png" alt="Cilt I" />
                  </div>
                  <span className={styles.miniBookTitle}>Cilt I</span>
                </a>
                <a href="/eserler/efendilikten-kolelige-2" className={styles.miniBook}>
                  <div className={styles.miniBookCover}>
                    <img src="/images/cilt2.png" alt="Cilt II" />
                  </div>
                  <span className={styles.miniBookTitle}>Cilt II</span>
                </a>
                <a href="/eserler/dgm-163" className={styles.miniBook}>
                  <div className={styles.miniBookCover}>
                    <img src="/images/dgm.jpg" alt="DGM 163" />
                  </div>
                  <span className={styles.miniBookTitle}>DGM 163</span>
                </a>
              </div>
            </div>
          </div>

          {/* VIDEOS BENTO (1x1) */}
          <a href="/videolar" className={`${styles.bentoItem} ${styles.bentoSmall} animate-slide-up delay-200`}>
            <div className={styles.bentoContentCenter}>
              <VideoIcon className={styles.iconSvgLarge} />
              <h3 className={styles.bentoTitleSmall}>Videolar</h3>
            </div>
          </a>

          {/* GALLERY BENTO (1x1) */}
          <a href="/galeri" className={`${styles.bentoItem} ${styles.bentoSmall} ${styles.bentoDark} animate-slide-up delay-300`}>
            <div className={styles.bentoContentCenter}>
              <CameraIcon className={styles.iconSvgLarge} />
              <h3 className={styles.bentoTitleSmall} style={{color: 'white'}}>Fotoğraflar</h3>
            </div>
          </a>

          {/* ARTICLES BENTO (1x1) */}
          <a href="/makaleler" className={`${styles.bentoItem} ${styles.bentoSmall} animate-slide-up delay-400`}>
            <div className={styles.bentoContent}>
              <ArticleIcon className={styles.iconSvg} />
              <h3 className={styles.bentoTitleSmall} style={{marginTop: '1rem'}}>Makaleler</h3>
              <p className={styles.bentoDescSmall}>Düşünce yazıları</p>
            </div>
          </a>

          {/* TIMELINE BENTO (1x1) */}
          <a href="/biyografi" className={`${styles.bentoItem} ${styles.bentoSmall} ${styles.bentoAccent} animate-slide-up delay-500`}>
            <div className={styles.bentoContentCenter}>
              <CalendarIcon className={styles.iconSvgLarge} />
              <h3 className={styles.bentoTitleSmall}>Kronoloji</h3>
            </div>
          </a>

          {/* MEMORIES BENTO (1x1) */}
          <a href="/anilar" className={`${styles.bentoItem} ${styles.bentoSmall} animate-slide-up delay-600`}>
            <div className={styles.bentoContentCenter}>
              <UsersIcon className={styles.iconSvgLarge} />
              <h3 className={styles.bentoTitleSmall}>Anılar</h3>
            </div>
          </a>

          {/* AUDIO BENTO (1x1) */}
          <AudioBento pinnedAudio={pinnedAudio} />

        </div>
      </section>

    </div>
  );
}
