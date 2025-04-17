import { NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma'; // Make sure this import is correct

export async function POST(req) {
  try {
    // Parse the request body
    const { userId, startDate, endDate, reason } = await req.json();

    // Validate the required fields
    if (!userId || !startDate || !endDate || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure startDate and endDate are valid Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    // Create a new leave request in the database
    const leaveRequest = await prisma.leave.create({
      data: {
        userId,
        startDate: start,
        endDate: end,
        reason,
      },
    });

    // Return the created leave request
    return NextResponse.json(leaveRequest, { status: 200 });
  } catch (error) {
    console.error('Error creating leave request:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
