import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'diger'; // video, galeri vb.

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dosya adını temizle ve benzersiz yap
    const ext = path.extname(file.name);
    const name = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${name}_${Date.now()}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'upload', folder);
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    // İstemci tarafında erişilebilir URL
    const fileUrl = `/upload/${folder}/${filename}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('Upload hatası:', error);
    return NextResponse.json({ error: 'Dosya yüklenemedi' }, { status: 500 });
  }
}
