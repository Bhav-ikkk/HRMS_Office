import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LogoutButton from "../components/logout";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    return <div className="p-4">Access denied. Admins only.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome, {session.user.name}!</h1>
      <p className="mt-2 text-gray-700">This is your admin dashboard.</p>
      <LogoutButton />
    </div>
  );
}
