import { getDb } from '@/lib/db';
import LoadMoreList from '@/components/LoadMoreList';

export const metadata = { title: 'Anılar | Hasan Damar' };

export default async function AnilarPage() {
  const db = await getDb();
  const memories = (db.memories || []).filter(m => !m.hidden);

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <div className="text-center">
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '0.5rem' }}>Anılar</h1>
        <div className="divider" style={{ width: '50px', height: '2px', backgroundColor: 'var(--color-secondary)', margin: '0 auto 2rem' }}></div>
        <p style={{ color: 'var(--color-text-muted-light)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
          Tarihe tanıklık eden olaylar ve yaşanmış özel hatıralar.
        </p>
      </div>

      <LoadMoreList items={memories} type="ani" />
    </div>
  );
}
