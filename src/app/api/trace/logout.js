import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/app/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const userId = session.user.id;

  const trace = await prisma.trace.findFirst({
    where: {
      userId,
      logoutAt: null,
    },
    orderBy: {
      loginAt: 'desc',
    },
  });

  if (!trace) {
    return res.status(400).json({ error: "No active login session!" });
  }

  const updatedTrace = await prisma.trace.update({
    where: { id: trace.id },
    data: {
      logoutAt: new Date(),
    },
  });

  res.status(200).json(updatedTrace);
}
