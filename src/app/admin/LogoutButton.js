'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#331515', color: '#ff6b6b', border: '1px solid #552222', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
    >
      Çıkış Yap
    </button>
  );
}
