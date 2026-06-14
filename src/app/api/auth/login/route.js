import { NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    let validUser = process.env.ADMIN_USER || 'yavuzdamar';
    let validPass = process.env.ADMIN_PASS || 'Yd@852741';

    if (username === validUser && password === validPass) {
      await createSession(username);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Geçersiz kullanıcı adı veya şifre' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
