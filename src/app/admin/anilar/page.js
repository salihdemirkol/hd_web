'use client';
import { useState, useEffect } from 'react';
import RichTextEditor from '@/components/RichTextEditor';

export default function AdminAnilar() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', date: '', location: '' });

  useEffect(() => {
    fetch('/api/memories').then(r => r.json()).then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.content || formData.content === '<p><br></p>') return alert('İçerik boş olamaz');
    setSaving(true);

    try {
      const isEdit = !!editId;
      const res = await fetch('/api/memories', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { id: editId, ...formData } : formData)
      });
      
      if (!res.ok) throw new Error('İşlem başarısız');
      const { item } = await res.json();
      
      if (isEdit) {
        setItems(items.map(i => i.id === item.id ? item : i));
        setEditId(null);
      } else {
        setItems([...items, item]);
      }
      
      setFormData({ title: '', content: '', date: '', location: '' });
      alert(isEdit ? 'Anı güncellendi!' : 'Anı başarıyla eklendi!');
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({ title: item.title, content: item.content, date: item.date, location: item.location || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleHide = async (item) => {
    try {
      const res = await fetch('/api/memories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, hidden: !item.hidden })
      });
      if (res.ok) {
        const { item: updated } = await res.json();
        setItems(items.map(i => i.id === updated.id ? updated : i));
      }
    } catch (e) {
      alert('İşlem başarısız');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu anıyı silmek istediğinize emin misiniz?')) return;
    
    try {
      const res = await fetch(`/api/memories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(items.filter(i => i.id !== id));
      }
    } catch (e) {
      alert('Silme işlemi başarısız');
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#fff' }}>Anı Yönetimi</h1>
      
      <div className="glass-panel" style={{ backgroundColor: 'rgba(25,25,25,0.6)', padding: '2rem', borderRadius: '16px', border: '1px solid #333', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-secondary)', fontSize: '1.25rem' }}>{editId ? 'Anıyı Düzenle' : 'Yeni Anı Ekle'}</h2>
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Anı Başlığı</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#fff' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Tarih / Yıl</label>
            <input type="text" placeholder="Örn: 1985 Yazı" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#fff' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Mekan / Şehir (Opsiyonel)</label>
            <input type="text" placeholder="Örn: Köln Merkez" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#fff' }} />
          </div>
          <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Anı İçeriği (Yazı)</label>
            <RichTextEditor value={formData.content} onChange={content => setFormData(prev => ({...prev, content}))} />
          </div>
          <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={saving} style={{ padding: '1rem 2rem', borderRadius: '8px', backgroundColor: 'var(--color-secondary)', color: '#000', fontWeight: 'bold', border: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Kaydediliyor...' : (editId ? 'Değişiklikleri Kaydet' : 'Anıyı Yayınla')}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setFormData({ title: '', content: '', date: '', location: '' }); }} style={{ padding: '1rem 2rem', borderRadius: '8px', backgroundColor: 'transparent', color: '#fff', border: '1px solid #555', cursor: 'pointer' }}>
                İptal Et
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-panel" style={{ backgroundColor: 'rgba(25,25,25,0.6)', padding: '2rem', borderRadius: '16px', border: '1px solid #333' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.25rem' }}>Mevcut Anılar</h2>
        {loading ? <p>Yükleniyor...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.length === 0 ? <p style={{ color: '#888' }}>Henüz anı eklenmemiş.</p> : items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', backgroundColor: item.hidden ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)', borderRadius: '8px', border: item.hidden ? '1px dashed #555' : '1px solid #333', transition: 'all 0.3s' }}>
                <div style={{ opacity: item.hidden ? 0.3 : 1, filter: item.hidden ? 'grayscale(100%)' : 'none', transition: 'all 0.3s' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-secondary)' }}>
                    {item.title} {item.hidden && <span style={{ fontSize: '0.75rem', backgroundColor: '#ff4757', color: '#fff', padding: '3px 8px', borderRadius: '4px', marginLeft: '12px', fontWeight: 'bold' }}>YAYINDAN KALDIRILDI</span>}
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#888' }}>
                    <span>📅 {item.date}</span>
                    {item.location && <span>📍 {item.location}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a href="/anilar" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', padding: '0.5rem 1rem', backgroundColor: '#218c74', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', opacity: item.hidden ? 0.3 : 1, pointerEvents: item.hidden ? 'none' : 'auto' }}>Gör</a>
                  <button onClick={() => handleEdit(item)} style={{ padding: '0.5rem 1rem', backgroundColor: '#3a3a3a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: item.hidden ? 0.3 : 1, pointerEvents: item.hidden ? 'none' : 'auto' }}>Düzenle</button>
                  <button onClick={() => handleToggleHide(item)} style={{ padding: '0.5rem 1rem', backgroundColor: item.hidden ? '#2ed573' : '#d35400', color: item.hidden ? '#000' : '#fff', fontWeight: item.hidden ? 'bold' : 'normal', border: 'none', borderRadius: '6px', cursor: 'pointer', boxShadow: item.hidden ? '0 0 10px rgba(46, 213, 115, 0.4)' : 'none' }}>{item.hidden ? '👁️ Yayına Al' : 'Gizle'}</button>
                  <button onClick={() => handleDelete(item.id)} style={{ padding: '0.5rem 1rem', backgroundColor: '#331515', color: '#ff6b6b', border: '1px solid #552222', borderRadius: '6px', cursor: 'pointer', opacity: item.hidden ? 0.3 : 1 }}>Sil</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
