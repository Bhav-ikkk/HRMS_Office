import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Placeholder for auth middleware (replace with your actual auth mechanism)
const getAuthUser = async (request) => {
  // Example: Extract user from JWT or session
  // Replace with your auth logic (e.g., verify JWT, check session)
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    throw new Error('Unauthorized');
  }
  // Mocked user data for demonstration
  return { id: request.params.id, role: 'EMPLOYEE' }; // Replace with real auth data
};

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const authUser = await getAuthUser(request);

    // Verify the user is authorized to access this data
    if (authUser.id !== id && authUser.role !== 'ADMIN') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
      });
    }

    let stats = {};

    if (authUser.role === 'ADMIN') {
      // Admin: Fetch aggregated stats
      const loggedInUsers = await prisma.session.count({
        where: {
          expires: {
            gt: new Date(),
          },
        },
      });

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const leavesRequestedToday = await prisma.leaveRequest.count({
        where: {
          createdAt: {
            gte: startOfDay,
          },
        },
      });

      const pendingApprovals = await prisma.leaveRequest.count({
        where: {
          status: 'PENDING',
        },
      });

      const departments = await prisma.department.count();

      stats = {
        loggedInUsers,
        leavesRequestedToday,
        pendingApprovals,
        departments,
      };
    } else {
      // Employee: Fetch user-specific stats
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: { department: true },
      });

      if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
        });
      }

      const loggedInUsers = await prisma.session.count({
        where: {
          userId: parseInt(id),
          expires: {
            gt: new Date(),
          },
        },
      });

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const leavesRequestedToday = await prisma.leaveRequest.count({
        where: {
          userId: parseInt(id),
          createdAt: {
            gte: startOfDay,
          },
        },
      });

      const pendingApprovals = await prisma.leaveRequest.count({
        where: {
          userId: parseInt(id),
          status: 'PENDING',
        },
      });

      const departments = user.department ? 1 : 0; // Employee belongs to one department

      stats = {
        loggedInUsers,
        leavesRequestedToday,
        pendingApprovals,
        departments,
      };
    }

    return new Response(JSON.stringify(stats), { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: error.message === 'Unauthorized' ? 401 : 500,
    });
  }
}