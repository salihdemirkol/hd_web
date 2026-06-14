import { getDb } from '@/lib/db';
import LoadMoreGallery from '@/components/LoadMoreGallery';

export const metadata = { title: 'Fotoğraf Galerisi | Hasan Damar' };
export const dynamic = 'force-dynamic';

export default async function GaleriPage() {
  const db = await getDb();
  const photos = (db.gallery || []).filter(p => !p.hidden);

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <div className="text-center">
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '0.5rem' }}>Tarihî Fotoğraf Galerisi</h1>
        <div className="divider" style={{ width: '50px', height: '2px', backgroundColor: 'var(--color-secondary)', margin: '0 auto 2rem' }}></div>
        <p style={{ color: 'var(--color-text-muted-light)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
          Milli Görüş hareketinin Avrupa'daki yolculuğundan özgün belgesel fotoğraflar.
        </p>
      </div>

      <LoadMoreGallery photos={photos} />
    </div>
  );
}
