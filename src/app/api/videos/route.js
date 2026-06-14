import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function GET() {
  const db = await getDb();
  return NextResponse.json(db.videos || []);
}

export async function POST(request) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

  try {
    const body = await request.json();
    const db = await getDb();
    
    const newVideo = {
      id: Date.now().toString(),
      ...body,
      order: db.videos.length
    };
    
    db.videos.push(newVideo);
    await saveDb(db);
    
    return NextResponse.json({ success: true, video: newVideo });
  } catch (error) {
    return NextResponse.json({ error: 'Veri kaydedilemedi' }, { status: 500 });
  }
}

export async function PUT(request) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

  try {
    const body = await request.json();
    const db = await getDb();
    
    // Toplu sıralama güncellemesi (Array gelirse)
    if (Array.isArray(body)) {
      db.videos = body;
      await saveDb(db);
      return NextResponse.json({ success: true });
    }
    
    // Tekil güncelleme
    const index = db.videos.findIndex(v => v.id === body.id);
    if (index !== -1) {
      db.videos[index] = { ...db.videos[index], ...body };
      await saveDb(db);
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Video bulunamadı' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Veri güncellenemedi' }, { status: 500 });
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
    db.videos = db.videos.filter(v => v.id !== id);
    await saveDb(db);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Veri silinemedi' }, { status: 500 });
  }
}
