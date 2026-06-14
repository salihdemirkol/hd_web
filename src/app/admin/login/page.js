'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Giriş başarısız');
      }
    } catch (err) {
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f0f0f', backgroundImage: 'radial-gradient(circle at center, #1a1a1a 0%, #000 100%)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', borderRadius: '24px', backgroundColor: 'rgba(25,25,25,0.6)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-secondary)', margin: '0 0 0.5rem 0', fontSize: '2rem' }}>Yönetici Girişi</h1>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>Lütfen bilgilerinizi giriniz</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(255,0,0,0.1)', color: '#ff6b6b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(255,0,0,0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Kullanıcı Adı</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#fff', outline: 'none' }}
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Şifre</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#fff', outline: 'none' }}
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ marginTop: '1rem', padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--color-secondary)', color: '#000', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}
