// /app/api/logout/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  await prisma.trace.updateMany({
    where: {
      userId: userId,
      logoutAt: null,
    },
    data: {
      logoutAt: new Date(),
    },
  });

  return NextResponse.json({ message: "Logout time recorded" });
}
