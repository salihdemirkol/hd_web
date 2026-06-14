import fs from 'fs/promises';
import path from 'path';
import Reader from './Reader';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return [
    { bookId: 'efendilikten-kolelige-1' },
    { bookId: 'efendilikten-kolelige-2' },
    { bookId: 'dgm-163' },
  ];
}

export async function generateMetadata({ params }) {
  const { bookId } = await params;
  let bookName = '';
  if (bookId === 'efendilikten-kolelige-1') bookName = '1. Cilt';
  else if (bookId === 'efendilikten-kolelige-2') bookName = '2. Cilt';
  else if (bookId === 'dgm-163') bookName = 'DGM 163';
  
  return {
    title: `${bookName} | Hasan Damar`,
    description: `Hasan Damar - ${bookName}`,
  };
}

export default async function BookPage({ params }) {
  const { bookId } = await params;
  
  let dataKey = null;
  if (bookId === 'efendilikten-kolelige-1') dataKey = 'book1';
  else if (bookId === 'efendilikten-kolelige-2') dataKey = 'book2';
  else if (bookId === 'dgm-163') dataKey = 'book3';
  else return notFound();

  // Read JSON file
  const filePath = path.join(process.cwd(), 'data', 'efendilik_content.json');
  let bookData = null;
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const allData = JSON.parse(fileContents);
    bookData = allData[dataKey];
  } catch (error) {
    console.error("Error loading book data:", error);
    return <div>Kitap verisi yüklenirken bir hata oluştu.</div>;
  }

  if (!bookData) return notFound();

  return (
    <div className="book-page-container">
      <Reader initialBook={bookData} bookId={dataKey} />
    </div>
  );
}
