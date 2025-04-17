// src/app/api/leave/all/route.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const leaveRequests = user.role === 'ADMIN'
      ? await prisma.leave.findMany({
          include: { user: { select: { name: true, email: true } } },
        })
      : await prisma.leave.findMany({
          where: { userId: user.id },
          include: { user: { select: { name: true, email: true } } },
        });

    return NextResponse.json(leaveRequests);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
