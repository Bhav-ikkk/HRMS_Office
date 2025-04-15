import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, email, password, departmentId } = await req.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "EMPLOYEE",
        department: {
          connect: {
            id: parseInt(departmentId),
          },
        },
      },
    });

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
