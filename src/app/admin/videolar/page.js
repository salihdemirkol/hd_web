'use client';
import { useState, useEffect } from 'react';

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: '', desc: '', date: '', file: null, url: '' });

  const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'

  useEffect(() => {
    fetch('/api/videos').then(r => r.json()).then(data => {
      setVideos(data);
      setLoading(false);
    });
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (uploadType === 'file' && !formData.file && !editId) return alert('Lütfen bir video dosyası seçin');
    if (uploadType === 'link' && !formData.url) return alert('Lütfen bir video linki girin');
    setUploading(true);

    try {
      let finalUrl = formData.url;

      if (uploadType === 'file' && formData.file) {
        // 1. Upload file
        const uploadData = new FormData();
        uploadData.append('file', formData.file);
        uploadData.append('folder', 'video');
        
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
        if (!uploadRes.ok) throw new Error('Yükleme başarısız');
        const resJson = await uploadRes.json();
        finalUrl = resJson.url;
      } else if (editId && uploadType === 'file' && !formData.file) {
        const existing = videos.find(v => v.id === editId);
        finalUrl = existing.url;
      }

      const isEdit = !!editId;
      // 2. Save DB entry
      const dbRes = await fetch('/api/videos', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isEdit && { id: editId }),
          title: formData.title,
          desc: formData.desc,
          date: formData.date,
          url: finalUrl
        })
      });
      
      if (!dbRes.ok) throw new Error(isEdit ? 'Veritabanı güncellemesi başarısız' : 'Veritabanı kaydı başarısız');
      
      if (isEdit) {
        setVideos(videos.map(v => v.id === editId ? { ...v, title: formData.title, desc: formData.desc, date: formData.date, url: finalUrl } : v));
        setEditId(null);
      } else {
        const { video } = await dbRes.json();
        setVideos([...videos, video]);
      }
      
      setFormData({ title: '', desc: '', date: '', file: null, url: '' });
      if (e.target.reset) e.target.reset();
      alert(isEdit ? 'Video güncellendi!' : 'Video başarıyla eklendi!');
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (video) => {
    setEditId(video.id);
    setFormData({ title: video.title, desc: video.desc || '', date: video.date, url: video.url, file: null });
    setUploadType(video.url.includes('http') && !video.url.includes('/uploads/') ? 'link' : 'file');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleHide = async (video) => {
    try {
      const res = await fetch('/api/videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: video.id, hidden: !video.hidden })
      });
      if (res.ok) {
        setVideos(videos.map(v => v.id === video.id ? { ...video, hidden: !video.hidden } : v));
      }
    } catch (e) {
      alert('İşlem başarısız');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu videoyu silmek istediğinize emin misiniz?')) return;
    
    try {
      const res = await fetch(`/api/videos?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVideos(videos.filter(v => v.id !== id));
      }
    } catch (e) {
      alert('Silme işlemi başarısız');
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#fff' }}>Video Yönetimi</h1>
      
      <div className="glass-panel" style={{ backgroundColor: 'rgba(25,25,25,0.6)', padding: '2rem', borderRadius: '16px', border: '1px solid #333', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.25rem', margin: 0 }}>{editId ? 'Videoyu Düzenle' : 'Yeni Video Ekle'}</h2>
          <div style={{ display: 'flex', gap: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px' }}>
            <button onClick={() => setUploadType('file')} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: uploadType === 'file' ? 'var(--color-secondary)' : 'transparent', color: uploadType === 'file' ? '#000' : '#888', fontWeight: uploadType === 'file' ? 'bold' : 'normal' }}>Bilgisayardan Yükle</button>
            <button onClick={() => setUploadType('link')} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: uploadType === 'link' ? 'var(--color-secondary)' : 'transparent', color: uploadType === 'link' ? '#000' : '#888', fontWeight: uploadType === 'link' ? 'bold' : 'normal' }}>Harici Link Ekle</button>
          </div>
        </div>
        <form onSubmit={handleUpload} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>{uploadType === 'file' ? 'Video Dosyası (MP4 vb.)' : 'Video Linki (YouTube, Drive vb.)'}</label>
            {uploadType === 'file' ? (
              <>
                <input type="file" accept="video/*" onChange={e => setFormData({...formData, file: e.target.files[0]})} style={{ color: '#fff' }} />
                {editId && <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Dosya seçmezseniz mevcut video korunur.</p>}
              </>
            ) : (
              <input type="url" placeholder="Örn: https://www.youtube.com/watch?v=..." value={formData.url || ''} onChange={e => setFormData({...formData, url: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#fff' }} />
            )}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Başlık</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#fff' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Tarih</label>
            <input type="text" placeholder="Örn: 12 Mayıs 2018" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#fff' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>Açıklama</label>
            <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} rows="6" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#fff', resize: 'vertical' }} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={uploading} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: 'var(--color-secondary)', color: '#000', fontWeight: 'bold', border: 'none', cursor: uploading ? 'not-allowed' : 'pointer' }}>
              {uploading ? 'Yükleniyor (Lütfen bekleyin)...' : (editId ? 'Değişiklikleri Kaydet' : 'Videoyu Yükle ve Ekle')}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setFormData({ title: '', desc: '', date: '', file: null, url: '' }); }} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: 'transparent', color: '#fff', border: '1px solid #555', cursor: 'pointer' }}>
                İptal Et
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-panel" style={{ backgroundColor: 'rgba(25,25,25,0.6)', padding: '2rem', borderRadius: '16px', border: '1px solid #333' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.25rem' }}>Mevcut Videolar</h2>
        {loading ? <p>Yükleniyor...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {videos.length === 0 ? <p style={{ color: '#888' }}>Henüz video eklenmemiş.</p> : videos.map((video) => (
              <div key={video.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: video.hidden ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)', borderRadius: '8px', border: video.hidden ? '1px dashed #555' : '1px solid #333', transition: 'all 0.3s' }}>
                <div style={{ opacity: video.hidden ? 0.3 : 1, filter: video.hidden ? 'grayscale(100%)' : 'none', transition: 'all 0.3s' }}>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-secondary)' }}>
                    {video.title} {video.hidden && <span style={{ fontSize: '0.75rem', backgroundColor: '#ff4757', color: '#fff', padding: '3px 8px', borderRadius: '4px', marginLeft: '12px', fontWeight: 'bold' }}>YAYINDAN KALDIRILDI</span>}
                  </h3>
                  <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>{video.url}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a href={video.url.includes('http') ? video.url : `/uploads/${video.url}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', padding: '0.5rem 1rem', backgroundColor: '#218c74', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', opacity: video.hidden ? 0.3 : 1, pointerEvents: video.hidden ? 'none' : 'auto' }}>Gör</a>
                  <button onClick={() => handleEdit(video)} style={{ padding: '0.5rem 1rem', backgroundColor: '#3a3a3a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: video.hidden ? 0.3 : 1, pointerEvents: video.hidden ? 'none' : 'auto' }}>Düzenle</button>
                  <button onClick={() => handleToggleHide(video)} style={{ padding: '0.5rem 1rem', backgroundColor: video.hidden ? '#2ed573' : '#d35400', color: video.hidden ? '#000' : '#fff', fontWeight: video.hidden ? 'bold' : 'normal', border: 'none', borderRadius: '6px', cursor: 'pointer', boxShadow: video.hidden ? '0 0 10px rgba(46, 213, 115, 0.4)' : 'none' }}>{video.hidden ? '👁️ Yayına Al' : 'Gizle'}</button>
                  <button onClick={() => handleDelete(video.id)} style={{ padding: '0.5rem 1rem', backgroundColor: '#331515', color: '#ff6b6b', border: '1px solid #552222', borderRadius: '6px', cursor: 'pointer', opacity: video.hidden ? 0.3 : 1 }}>Sil</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
