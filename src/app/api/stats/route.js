import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

  const db = await getDb();
  
  return NextResponse.json({
    videosCount: db.videos?.length || 0,
    galleryCount: db.gallery?.length || 0,
    totalViews: db.stats?.totalViews || 0,
    totalVisitors: db.stats?.totalVisitors || 0
  });
}
