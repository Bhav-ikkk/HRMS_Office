'use client';

import { useEffect, useState } from 'react';
import { useAbility } from '../../context/AbilityContext'; // Use alias if available, else adjust path

export default function Dashboard() {
  const ability = useAbility();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    // Check if user has permission to access the Dashboard
    setIsAllowed(ability.can('read', 'Dashboard'));
  }, [ability]);

  if (!isAllowed) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl text-red-600 font-bold">Access Denied 🚫</h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">🎉 Welcome to the Dashboard</h1>
      <p>This content is protected by CASL and visible only to users with the right permissions.</p>
    </div>
  );
}
