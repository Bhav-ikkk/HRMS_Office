import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password, departmentId } = await req.json();

    if (!name || !email || !password || !departmentId) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        department: {
          connect: { id: parseInt(departmentId) },
        },
        role: "EMPLOYEE", // 🔥 Important part here
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
