import { getDb } from '@/lib/db';
import LoadMoreAudios from '@/components/LoadMoreAudios';

export const metadata = { title: 'Ses Kayıtları | Hasan Damar' };
export const dynamic = 'force-dynamic';

export default async function SesKayitlariPage() {
  const db = await getDb();
  const audios = (db.audios || []).filter(a => !a.hidden);

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <div className="text-center">
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '0.5rem' }}>Ses Kayıtları</h1>
        <div className="divider" style={{ width: '50px', height: '2px', backgroundColor: 'var(--color-secondary)', margin: '0 auto 2rem' }}></div>
        <p style={{ color: 'var(--color-text-muted-light)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
          Sohbetler, röportajlar ve radyo kayıtları.
        </p>
      </div>

      <LoadMoreAudios audios={audios} />
    </div>
  );
}
