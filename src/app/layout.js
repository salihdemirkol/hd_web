import './globals.css';
import { Inter, Amiri } from 'next/font/google';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const amiri = Amiri({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-amiri' });

export const metadata = {
  title: 'Hasan Damar (1940-2023) | Resmi Anma ve Biyografi Sitesi',
  description: 'Milli Görüş davasına adanmış bir ömür. Hasan Damar\'ın hayatı, eserleri ve mirasını yaşatan resmi anma sitesi.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${inter.variable} ${amiri.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <footer className="main-footer">
          <div className="container">
            <div className="footer-divider"></div>
            <p>&copy; {new Date().getFullYear()} Hasan Damar Vakfı. Tüm hakları saklıdır.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
