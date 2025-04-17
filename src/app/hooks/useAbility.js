// hooks/useAbility.js
'use client';

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { defineAbilitiesFor } from '../lib/ability';

export const useAbility = () => {
  const { data: session } = useSession();
  const role = session?.user?.role || 'guest';
  return useMemo(() => defineAbilitiesFor(role), [role]);
};