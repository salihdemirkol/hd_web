import { getDb } from '@/lib/db';
import LoadMoreVideos from '@/components/LoadMoreVideos';

export const metadata = { title: 'Videolar | Hasan Damar' };

export default async function VideolarPage() {
  const db = await getDb();
  const videos = db.videos || [];

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <div className="text-center">
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '0.5rem' }}>Videolar</h1>
        <div className="divider" style={{ width: '50px', height: '2px', backgroundColor: 'var(--color-secondary)', margin: '0 auto 2rem' }}></div>
        <p style={{ color: 'var(--color-text-muted-light)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
          Hasan Damar'ın katıldığı programlar, konferans kayıtları ve röportaj videoları.
        </p>
      </div>

      <LoadMoreVideos videos={videos} />
    </div>
  );
}
