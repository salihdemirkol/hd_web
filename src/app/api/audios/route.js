import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function GET() {
  const db = await getDb();
  return NextResponse.json(db.audios || []);
}

export async function POST(request) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

  try {
    const body = await request.json();
    const db = await getDb();
    
    if (!db.audios) db.audios = [];
    
    const newAudio = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      order: db.audios.length
    };
    
    db.audios.push(newAudio);
    await saveDb(db);
    
    return NextResponse.json({ success: true, item: newAudio });
  } catch (error) {
    return NextResponse.json({ error: 'Kayıt başarısız' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const db = await getDb();
    
    if (!db.audios) return NextResponse.json({ error: 'Kayıt bulunamadı' }, { status: 404 });
    
    db.audios = db.audios.filter(v => v.id !== id);
    await saveDb(db);
    
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
    
    if (!db.audios) return NextResponse.json({ error: 'Kayıt bulunamadı' }, { status: 404 });
    
    const index = db.audios.findIndex(i => i.id === body.id);
    if (index === -1) return NextResponse.json({ error: 'Ses kaydı bulunamadı' }, { status: 404 });
    
    db.audios[index] = { ...db.audios[index], ...body };
    await saveDb(db);
    
    return NextResponse.json({ success: true, item: db.audios[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Güncelleme başarısız' }, { status: 500 });
  }
}
