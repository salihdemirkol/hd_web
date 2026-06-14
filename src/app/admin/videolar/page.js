'use client';
import { useState, useEffect } from 'react';

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ title: '', desc: '', date: '', file: null });

  const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'

  useEffect(() => {
    fetch('/api/videos').then(r => r.json()).then(data => {
      setVideos(data);
      setLoading(false);
    });
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (uploadType === 'file' && !formData.file) return alert('Lütfen bir video dosyası seçin');
    if (uploadType === 'link' && !formData.url) return alert('Lütfen bir video linki girin');
    setUploading(true);

    try {
      let finalUrl = formData.url;

      if (uploadType === 'file') {
        // 1. Upload file
        const uploadData = new FormData();
        uploadData.append('file', formData.file);
        uploadData.append('folder', 'video');
        
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
        if (!uploadRes.ok) throw new Error('Yükleme başarısız');
        const resJson = await uploadRes.json();
        finalUrl = resJson.url;
      }

      // 2. Save DB entry
      const dbRes = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          desc: formData.desc,
          date: formData.date,
          url: finalUrl
        })
      });
      
      if (!dbRes.ok) throw new Error('Veritabanı kaydı başarısız');
      const { video } = await dbRes.json();
      
      setVideos([...videos, video]);
      setFormData({ title: '', desc: '', date: '', file: null, url: '' });
      e.target.reset();
      alert('Video başarıyla eklendi!');
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
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
          <h2 style={{ color: 'var(--color-secondary)', fontSize: '1.25rem', margin: 0 }}>Yeni Video Ekle</h2>
          <div style={{ display: 'flex', gap: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px' }}>
            <button onClick={() => setUploadType('file')} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: uploadType === 'file' ? 'var(--color-secondary)' : 'transparent', color: uploadType === 'file' ? '#000' : '#888', fontWeight: uploadType === 'file' ? 'bold' : 'normal' }}>Bilgisayardan Yükle</button>
            <button onClick={() => setUploadType('link')} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: uploadType === 'link' ? 'var(--color-secondary)' : 'transparent', color: uploadType === 'link' ? '#000' : '#888', fontWeight: uploadType === 'link' ? 'bold' : 'normal' }}>Harici Link Ekle</button>
          </div>
        </div>
        <form onSubmit={handleUpload} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa' }}>{uploadType === 'file' ? 'Video Dosyası (MP4 vb.)' : 'Video Linki (YouTube, Drive vb.)'}</label>
            {uploadType === 'file' ? (
              <input type="file" accept="video/*" onChange={e => setFormData({...formData, file: e.target.files[0]})} required style={{ color: '#fff' }} />
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
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" disabled={uploading} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: 'var(--color-secondary)', color: '#000', fontWeight: 'bold', border: 'none', cursor: uploading ? 'not-allowed' : 'pointer' }}>
              {uploading ? 'Yükleniyor (Lütfen bekleyin)...' : 'Videoyu Yükle ve Ekle'}
            </button>
          </div>
        </form>
      </div>

      <div className="glass-panel" style={{ backgroundColor: 'rgba(25,25,25,0.6)', padding: '2rem', borderRadius: '16px', border: '1px solid #333' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.25rem' }}>Mevcut Videolar</h2>
        {loading ? <p>Yükleniyor...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {videos.length === 0 ? <p style={{ color: '#888' }}>Henüz video eklenmemiş.</p> : videos.map((video, idx) => (
              <div key={video.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid #333' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-secondary)' }}>{video.title}</h3>
                  <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>{video.url}</p>
                </div>
                <button onClick={() => handleDelete(video.id)} style={{ padding: '0.5rem 1rem', backgroundColor: '#331515', color: '#ff6b6b', border: '1px solid #552222', borderRadius: '6px', cursor: 'pointer' }}>
                  Sil
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
