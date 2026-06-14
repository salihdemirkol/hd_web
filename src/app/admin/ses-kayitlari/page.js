'use client';
import { useState, useEffect, useRef } from 'react';

export default function AdminSesKayitlari() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    date: '',
    url: ''
  });

  useEffect(() => {
    fetch('/api/audios').then(r => r.json()).then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalUrl = formData.url;

      if (uploadType === 'file' && fileInputRef.current?.files[0]) {
        const file = fileInputRef.current.files[0];
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'ses');

        const upRes = await fetch('/api/upload', { method: 'POST', body: fd });
        if (!upRes.ok) throw new Error('Ses yüklenemedi');
        const upData = await upRes.json();
        finalUrl = upData.url;
      } else if (editId && uploadType === 'file' && (!fileInputRef.current || !fileInputRef.current.files[0])) {
        const existing = items.find(i => i.id === editId);
        finalUrl = existing.url;
      }

      if (!finalUrl) throw new Error('Lütfen ses dosyası seçin veya link girin');

      const isEdit = !!editId;
      const bodyData = { 
        ...(isEdit && { id: editId }),
        ...formData, 
        url: finalUrl 
      };

      const res = await fetch('/api/audios', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      
      if (!res.ok) throw new Error(isEdit ? 'Güncelleme başarısız' : 'İşlem başarısız');
      
      if (isEdit) {
        setItems(items.map(i => i.id === editId ? { ...i, ...formData, url: finalUrl } : i));
        setEditId(null);
      } else {
        const { item } = await res.json();
        setItems([...items, item]);
      }

      setFormData({ title: '', desc: '', date: '', url: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      alert(isEdit ? 'Ses kaydı güncellendi!' : 'Ses kaydı başarıyla eklendi!');
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({ title: item.title, desc: item.desc || '', date: item.date, url: item.url });
    setUploadType(item.url.includes('http') && !item.url.includes('/uploads/') ? 'link' : 'file');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  const handleDelete = async (id) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/audios?id=${id}`, { method: 'DELETE' });
      if (res.ok) setItems(items.filter(i => i.id !== id));
    } catch (e) {
      alert('Silme işlemi başarısız');
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#fff' }}>Ses Kayıtları Yönetimi</h1>
      
      <div className="glass-panel" style={{ backgroundColor: 'rgba(25,25,25,0.6)', padding: '2rem', borderRadius: '16px', border: '1px solid #333', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-secondary)', fontSize: '1.25rem' }}>{editId ? 'Ses Kaydını Düzenle' : 'Yeni Ses Kaydı Ekle'}</h2>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button type="button" onClick={() => setUploadType('file')} style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: uploadType === 'file' ? '2px solid var(--color-secondary)' : '1px solid #444', backgroundColor: uploadType === 'file' ? 'rgba(220,167,91,0.1)' : 'transparent', color: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>
            Bilgisayardan Yükle (MP3)
          </button>
          <button type="button" onClick={() => setUploadType('link')} style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: uploadType === 'link' ? '2px solid var(--color-secondary)' : '1px solid #444', backgroundColor: uploadType === 'link' ? 'rgba(220,167,91,0.1)' : 'transparent', color: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>
            Harici Link Ekle (Spotify vb.)
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Başlık</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#fff' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Tarih / Yıl</label>
            <input type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#fff' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Açıklama (Opsiyonel)</label>
            <input type="text" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#fff' }} />
          </div>
          
          <div style={{ gridColumn: '1 / -1', marginTop: '1rem', padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px dashed #555' }}>
            {uploadType === 'file' ? (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>MP3 Dosyası Seç</label>
                <input type="file" accept="audio/*" ref={fileInputRef} style={{ color: '#fff' }} />
                {editId ? (
                  <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Dosya seçmezseniz mevcut ses kaydı korunur.</p>
                ) : (
                  <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Lütfen .mp3 veya benzeri bir ses dosyası seçin.</p>
                )}
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Spotify / SoundCloud Linki veya Embed Kodu</label>
                <input type="text" placeholder="Örn: https://open.spotify.com/embed/episode/..." value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#fff' }} />
                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Spotify veya SoundCloud platformlarından aldığınız "Embed (Gömme)" linkini buraya yapıştırın.</p>
              </div>
            )}
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={saving} style={{ padding: '1rem 2rem', borderRadius: '8px', backgroundColor: 'var(--color-secondary)', color: '#000', fontWeight: 'bold', border: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Yükleniyor...' : (editId ? 'Değişiklikleri Kaydet' : 'Ses Kaydını Yayınla')}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setFormData({ title: '', desc: '', date: '', url: '' }); if (fileInputRef.current) fileInputRef.current.value = ''; }} style={{ padding: '1rem 2rem', borderRadius: '8px', backgroundColor: 'transparent', color: '#fff', border: '1px solid #555', cursor: 'pointer' }}>
                İptal Et
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-panel" style={{ backgroundColor: 'rgba(25,25,25,0.6)', padding: '2rem', borderRadius: '16px', border: '1px solid #333' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.25rem' }}>Mevcut Ses Kayıtları</h2>
        {loading ? <p>Yükleniyor...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.length === 0 ? <p style={{ color: '#888' }}>Henüz kayıt eklenmemiş.</p> : items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid #333' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-secondary)' }}>{item.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#888' }}>
                    <span>📅 {item.date}</span>
                    <span>🎙️ {item.url.includes('spotify') ? 'Spotify' : (item.url.includes('soundcloud') ? 'SoundCloud' : 'Sunucu (MP3)')}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a href={item.url.includes('http') ? item.url : `/uploads/${item.url}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', padding: '0.5rem 1rem', backgroundColor: '#218c74', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>Gör</a>
                  <button onClick={() => handleEdit(item)} style={{ padding: '0.5rem 1rem', backgroundColor: '#3a3a3a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Düzenle</button>
                  <button onClick={() => handleDelete(item.id)} style={{ padding: '0.5rem 1rem', backgroundColor: '#331515', color: '#ff6b6b', border: '1px solid #552222', borderRadius: '6px', cursor: 'pointer' }}>Sil</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
