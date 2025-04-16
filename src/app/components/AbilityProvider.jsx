'use client';

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { createMongoAbility } from '@casl/ability';
import { AbilityContext } from '../context/AbilityContext';
import { defineRulesFor } from '../casl/ability';

export default function AbilityProvider({ children }) {
  const { data: session } = useSession();

  const ability = useMemo(() => {
    const role = session?.user?.role || 'guest';
    return createMongoAbility(defineRulesFor(role));
  }, [session]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
