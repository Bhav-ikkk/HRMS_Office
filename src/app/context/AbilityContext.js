'use client';

import { createContext, useContext, useMemo } from 'react';
import { createMongoAbility, AbilityBuilder } from '@casl/ability';

export const AbilityContext = createContext();

export const AbilityProvider = ({ user, children }) => {
  const ability = useMemo(() => {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user?.role === 'admin') {
      can('manage', 'all');
    } else if (user?.role === 'employee') {
      can('read', 'Dashboard');
      can('read', 'LiveHours');
      can('create', 'LeaveRequest');
    } else {
      cannot('manage', 'all');
    }

    return build();
  }, [user]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export const useAbility = () => useContext(AbilityContext);
