import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function GET() {
  const db = await getDb();
  return NextResponse.json(db.articles || []);
}

export async function POST(request) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

  try {
    const body = await request.json();
    const db = await getDb();
    
    const newItem = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      order: db.articles?.length || 0
    };
    
    if (!db.articles) db.articles = [];
    db.articles.push(newItem);
    await saveDb(db);
    
    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    return NextResponse.json({ error: 'Veri kaydedilemedi' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });

    const db = await getDb();
    if (db.articles) {
      db.articles = db.articles.filter(i => i.id !== id);
      await saveDb(db);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Veri silinemedi' }, { status: 500 });
  }
}

export async function PUT(request) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

  try {
    const body = await request.json();
    const db = await getDb();
    
    if (!db.articles) return NextResponse.json({ error: 'Kayıt bulunamadı' }, { status: 404 });
    
    const index = db.articles.findIndex(i => i.id === body.id);
    if (index === -1) return NextResponse.json({ error: 'Makale bulunamadı' }, { status: 404 });
    
    db.articles[index] = { ...db.articles[index], ...body };
    await saveDb(db);
    
    return NextResponse.json({ success: true, item: db.articles[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Güncelleme başarısız' }, { status: 500 });
  }
}
