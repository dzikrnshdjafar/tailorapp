import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    console.log(body)

    // Validasi input
    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    // Cek apakah username ada di database
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    // Bandingkan password yang di-hash
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    // Jika username dan password valid, Anda bisa membuat token JWT
    // atau melakukan tindakan lain seperti menyimpan session.

    // Misalnya, buat token dan kirim ke client (di sini Anda bisa menggunakan JWT)
    const token = 'dummy-token-for-now'; // Ganti dengan token yang di-generate, misalnya JWT.

    // Berikan token ke client untuk disimpan di cookies atau localStorage
    return NextResponse.json({ message: 'Login successful', token }, { status: 200 });

  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
