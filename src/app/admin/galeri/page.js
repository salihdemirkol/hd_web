'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', file: null });

  useEffect(() => {
    fetch('/api/gallery').then(r => r.json()).then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingId && !formData.file) return alert('Lütfen yeni ekleme için bir resim dosyası seçin');
    setUploading(true);

    try {
      let finalUrl = null;
      if (formData.file) {
        const uploadData = new FormData();
        uploadData.append('file', formData.file);
        uploadData.append('folder', 'galeri');
        
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
        if (!uploadRes.ok) throw new Error('Resim yükleme başarısız');
        const { url } = await uploadRes.json();
        finalUrl = url;
      }

      const method = editingId ? 'PUT' : 'POST';
      const bodyPayload = {
        id: editingId,
        title: formData.title,
        content: formData.content
      };
      
      // Only include URL if a new file was uploaded or it's a new entry (API expects URL for new)
      if (finalUrl) bodyPayload.url = finalUrl;
      else if (editingId) {
        // preserve old url
        const oldItem = items.find(i => i.id === editingId);
        if (oldItem) bodyPayload.url = oldItem.url;
      }

      const dbRes = await fetch('/api/gallery', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      
      if (!dbRes.ok) throw new Error('Veritabanı işlemi başarısız');
      const { item } = await dbRes.json();
      
      if (editingId) {
        setItems(items.map(i => i.id === editingId ? item : i));
      } else {
        setItems([...items, item]);
      }
      
      resetForm();
      alert(`Fotoğraf başarıyla ${editingId ? 'güncellendi' : 'eklendi'}!`);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      if (res.ok) setItems(items.filter(i => i.id !== id));
    } catch (e) {
      alert('Silme işlemi başarısız');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ title: item.title || '', content: item.content || '', file: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', file: null });
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#fff' }}>Galeri Yönetimi</h1>
      
      <div className="glass-panel" style={{ backgroundColor: 'rgba(25,25,25,0.6)', padding: '2rem', borderRadius: '16px', border: '1px solid #333', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-secondary)', fontSize: '1.25rem' }}>
          {editingId ? 'Fotoğrafı Düzenle' : 'Yeni Fotoğraf Ekle'}
        </h2>
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>
              Resim Dosyası (JPG, PNG, WebP) {editingId && <span style={{color: '#888', fontSize: '0.8rem'}}>(Değiştirmek istemiyorsanız boş bırakın)</span>}
            </label>
            <input type="file" accept="image/*" onChange={e => setFormData({...formData, file: e.target.files[0]})} style={{ color: '#fff' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Kısa Başlık</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#fff' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Detaylı Açıklama / Hikaye</label>
            <div style={{ borderRadius: '8px', overflow: 'hidden' }}>
              <RichTextEditor value={formData.content} onChange={val => setFormData({...formData, content: val})} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" disabled={uploading} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: 'var(--color-secondary)', color: '#000', fontWeight: 'bold', border: 'none', cursor: uploading ? 'not-allowed' : 'pointer' }}>
              {uploading ? 'İşleniyor...' : (editingId ? 'Güncelle' : 'Yükle ve Ekle')}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}>
                İptal Et
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-panel" style={{ backgroundColor: 'rgba(25,25,25,0.6)', padding: '2rem', borderRadius: '16px', border: '1px solid #333' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.25rem' }}>Mevcut Fotoğraflar</h2>
        {loading ? <p>Yükleniyor...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {items.length === 0 ? <p style={{ color: '#888' }}>Henüz fotoğraf eklenmemiş.</p> : items.map((item) => (
              <div key={item.id} style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <img src={item.url} alt={item.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                  <p style={{ margin: 0, color: 'var(--color-secondary)', fontSize: '0.9rem', fontWeight: 'bold' }}>{item.title}</p>
                  <p style={{ margin: 0, color: '#aaa', fontSize: '0.8rem', flexGrow: 1 }} dangerouslySetInnerHTML={{ __html: item.content ? (item.content.substring(0, 50) + '...') : '' }}></p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button onClick={() => handleEdit(item)} style={{ flex: 1, padding: '0.5rem', backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer' }}>
                      Düzenle
                    </button>
                    <button onClick={() => handleDelete(item.id)} style={{ flex: 1, padding: '0.5rem', backgroundColor: '#331515', color: '#ff6b6b', border: '1px solid #552222', borderRadius: '6px', cursor: 'pointer' }}>
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
