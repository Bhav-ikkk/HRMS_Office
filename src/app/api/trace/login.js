import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/app/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const userId = session.user.id;

  // Prevent double login
  const existingTrace = await prisma.trace.findFirst({
    where: {
      userId,
      logoutAt: null,
    },
  });

  if (existingTrace) {
    return res.status(400).json({ error: "Already clocked in!" });
  }

  const newTrace = await prisma.trace.create({
    data: {
      userId,
      loginAt: new Date(),
    },
  });

  res.status(200).json(newTrace);
}
