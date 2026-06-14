import { verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';

export default async function DashboardPage() {
  const session = await verifySession();
  if (!session) redirect('/admin/login');

  const db = await getDb();
  
  const stats = [
    { label: 'Toplam Video', value: db.videos?.length || 0, icon: '🎥' },
    { label: 'Galeri Fotoğrafı', value: db.gallery?.length || 0, icon: '🖼️' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#fff' }}>Dashboard / İstatistikler</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel" style={{ backgroundColor: 'rgba(25,25,25,0.6)', padding: '2rem', borderRadius: '16px', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ fontSize: '3rem' }}>{stat.icon}</div>
            <div>
              <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{stat.label}</div>
              <div style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: 'rgba(25,25,25,0.6)', borderRadius: '16px', border: '1px solid #333' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--color-secondary)' }}>Sisteme Hoş Geldiniz</h2>
        <p style={{ color: '#aaa', lineHeight: '1.6' }}>
          Sol taraftaki menüyü kullanarak site içeriklerini yönetebilirsiniz. Yüklediğiniz videolar ve fotoğraflar sunucuya (upload klasörüne) yüklenecek ve ana sitede anında aktif olacaktır. Clean URL ve güvenli altyapı standartlarına uygundur.
        </p>
      </div>
    </div>
  );
}
