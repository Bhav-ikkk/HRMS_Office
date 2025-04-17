// File: /app/api/departments/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const departments = await prisma.department.findMany();
  return NextResponse.json(departments);
}
