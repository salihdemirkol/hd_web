import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function GET() {
  const db = await getDb();
  return NextResponse.json(db.memories || []);
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
      order: db.memories?.length || 0
    };
    
    if (!db.memories) db.memories = [];
    db.memories.push(newItem);
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
    if (db.memories) {
      db.memories = db.memories.filter(i => i.id !== id);
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
    
    if (!db.memories) return NextResponse.json({ error: 'Kayıt bulunamadı' }, { status: 404 });
    
    const index = db.memories.findIndex(i => i.id === body.id);
    if (index === -1) return NextResponse.json({ error: 'Anı bulunamadı' }, { status: 404 });
    
    db.memories[index] = { ...db.memories[index], ...body };
    await saveDb(db);
    
    return NextResponse.json({ success: true, item: db.memories[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Güncelleme başarısız' }, { status: 500 });
  }
}
