import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  // Check if departments already exist
  const existing = await prisma.department.findMany();
  if (existing.length > 0) {
    return NextResponse.json({ message: "Departments already seeded" });
  }

  // Seed departments
  const departments = await prisma.department.createMany({
    data: [
      { name: "Marketing" },
      { name: "Technical" },
      { name: "Logistics" },
      { name: "Design" },
    ],
  });

  return NextResponse.json(departments);
}
