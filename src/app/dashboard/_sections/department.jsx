"use client"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Typography, Box, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";

export async function GET() {
  const session = await getServerSession(authOptions);

  // ✅ Check if user is logged in and is admin
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch employees along with their department, excluding the logged-in admin
    const employees = await prisma.user.findMany({
      where: {
        NOT: { email: session.user.email },  // Exclude logged-in admin
      },
      include: {
        department: true,  // Include department data
      },
    });

    return NextResponse.json({ employees }, { status: 200 });
  } catch (error) {
    console.error("Error fetching employees: ", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export default async function DepartmentPage() {
  const session = await getServerSession(authOptions);

  // If the session is not valid or user is not an admin, show unauthorized page
  if (!session || session.user.role !== "ADMIN") {
    return <Typography>Unauthorized</Typography>;
  }

  // Fetch employees from the database, excluding the logged-in admin
  const employees = await prisma.user.findMany({
    where: {
      NOT: { email: session.user.email },  // Exclude logged-in admin
    },
    include: {
      department: true,  // Include department info with employees
    },
  });

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Employee List by Department
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.role}</TableCell>
              <TableCell>{employee.department ? employee.department.name : 'No Department'}</TableCell>
              <TableCell>
                <Button variant="outlined" color="primary">Edit</Button>
                <Button variant="outlined" color="secondary" sx={{ marginLeft: 1 }}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
