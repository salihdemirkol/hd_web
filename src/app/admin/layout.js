import { verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default async function AdminLayout({ children }) {
  const session = await verifySession();
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f0f0f', color: '#fff' }}>
      {session && (
        <aside style={{ width: '250px', minWidth: '250px', flexShrink: 0, backgroundColor: '#1a1a1a', borderRight: '1px solid #333', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h2 style={{ margin: 0, color: 'var(--color-secondary)' }}>Yönetim Paneli</h2>
            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Hoş geldin, {session.username}</p>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
            <Link href="/admin" style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', textDecoration: 'none' }}>📊 Dashboard</Link>
            <Link href="/admin/videolar" style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', textDecoration: 'none' }}>🎥 Videolar</Link>
            <Link href="/admin/galeri" style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', textDecoration: 'none' }}>🖼️ Galeri</Link>
            <Link href="/admin/makaleler" style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', textDecoration: 'none' }}>📝 Makaleler</Link>
            <Link href="/admin/anilar" style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', textDecoration: 'none' }}>💭 Anılar</Link>
            <Link href="/admin/ses-kayitlari" style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', textDecoration: 'none' }}>🎙️ Ses Kayıtları</Link>
            <Link href="/" target="_blank" style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', textDecoration: 'none', marginTop: '1rem', border: '1px solid #333' }}>🌐 Siteye Git</Link>
          </nav>
          
          <div style={{ marginTop: 'auto' }}>
            <LogoutButton />
          </div>
        </aside>
      )}
      <main style={{ flexGrow: 1, padding: session ? '2rem 4rem' : '0', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
