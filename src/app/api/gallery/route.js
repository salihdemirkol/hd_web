import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function GET() {
  const db = await getDb();
  return NextResponse.json(db.gallery || []);
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
      order: db.gallery.length
    };
    
    db.gallery.push(newItem);
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
    db.gallery = db.gallery.filter(i => i.id !== id);
    await saveDb(db);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Veri silinemedi' }, { status: 500 });
  }
}
