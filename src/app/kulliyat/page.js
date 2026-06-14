export const metadata = { title: 'Külliyat | Hasan Damar' };

export default function KulliyatPage() {
  const books = [
    {
      id: 1,
      title: 'Efendilikten Köleliğe',
      subtitle: 'Cilt I',
      desc: 'Avrupa\'da Milli Görüş Hareketi\'nin tarihi, ilk tohumların atılması ve teşkilatlanma süreçlerini konu alan birinci cilt.',
      status: 'available',
      cover: '/images/cilt1.webp',
      slug: 'efendilikten-kolelige-1'
    },
    {
      id: 2,
      title: 'Efendilikten Köleliğe',
      subtitle: 'Cilt II',
      desc: 'Harekâtın büyümesi, karşılaşılan zorluklar ve Avrupa\'daki Müslümanların kurumsallaşma adımlarını anlatan ikinci cilt.',
      status: 'available',
      cover: '/images/cilt2.webp',
      slug: 'efendilikten-kolelige-2'
    },
    {
      id: 3,
      title: 'DGM 163',
      subtitle: 'Tarihi Savunma',
      desc: 'İnancı uğruna bedel ödeyenlerin, Devlet Güvenlik Mahkemeleri\'ndeki tarihi duruşları ve hak mücadelesi.',
      status: 'available',
      cover: '/images/dgm.webp',
      slug: 'dgm-163'
    }
  ];

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <div className="text-center">
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '0.5rem' }}>Külliyat</h1>
        <div className="divider" style={{ width: '50px', height: '2px', backgroundColor: 'var(--color-secondary)', margin: '0 auto 2rem' }}></div>
        <p style={{ color: 'var(--color-text-muted-light)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 4rem' }}>
          Hasan Damar'ın bizzat kaleme aldığı eserler, tarihi vesikalar ve yayınlanmış kitapları.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
        {books.map(book => (
          <div key={book.id} style={{ 
            backgroundColor: 'var(--color-bg-alt)', 
            borderRadius: '24px', 
            padding: '3rem 2rem', 
            boxShadow: 'var(--shadow-lg)', 
            border: '1px solid rgba(220, 167, 91, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {book.status === 'upcoming' && (
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '-35px',
                backgroundColor: 'var(--color-secondary)',
                color: '#000',
                padding: '5px 40px',
                transform: 'rotate(45deg)',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>
                YAKINDA
              </div>
            )}
            
            <div style={{ 
              width: '160px', 
              height: '240px', 
              borderRadius: '8px', 
              boxShadow: '10px 10px 20px rgba(0,0,0,0.5)',
              marginBottom: '2rem',
              overflow: 'hidden'
            }}>
              <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
              {book.title}
            </h2>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-secondary)', marginBottom: '1.5rem' }}>
              {book.subtitle}
            </h3>
            
            <p style={{ color: 'var(--color-text-main)', fontSize: '0.95rem', lineHeight: '1.6', flexGrow: 1 }}>
              {book.desc}
            </p>

            <a href={`/eserler/${book.slug}`} className={`btn-incele ${book.status}`} style={{
              marginTop: '2rem',
              padding: '0.75rem 2rem',
              backgroundColor: book.status === 'upcoming' ? 'transparent' : '#3a3a3a',
              border: book.status === 'upcoming' ? '1px solid #555' : 'none',
              color: book.status === 'upcoming' ? '#888' : '#fff',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
            }}>
              {book.status === 'upcoming' ? 'Hazırlanıyor' : 'İncele'}
            </a>
          </div>
        ))}
      </div>
      <style>{`
        .btn-incele.available:hover {
          background-color: var(--color-secondary) !important;
          color: #000 !important;
        }
      `}</style>
    </div>
  );
}
