// /app/api/admin/traces/route.js
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userEmail = session.user.email;
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ ADMIN: See all traces
    if (user.role === "ADMIN") {
      const allTraces = await prisma.trace.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          loginAt: "desc",
        },
      });

      return NextResponse.json(allTraces);
    }

    // ✅ EMPLOYEE: See only their own traces
    const employeeTraces = await prisma.trace.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        loginAt: "desc",
      },
    });

    return NextResponse.json(employeeTraces);
  } catch (error) {
    console.error("Error fetching traces:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
