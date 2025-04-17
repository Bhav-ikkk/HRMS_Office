// src/app/api/leave/update/route.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  const { id, status } = await req.json();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const updatedLeave = await prisma.leave.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedLeave);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
    