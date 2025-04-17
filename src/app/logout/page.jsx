// Somewhere in your dashboard JSX
"use client";
import { signOut, useSession } from "next-auth/react";

export default function LogoutButton() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      body: JSON.stringify({ userId: session.user.id }),
      headers: { "Content-Type": "application/json" },
    });

    signOut({ callbackUrl: "/login" });
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
      Logout
    </button>
  );
}
