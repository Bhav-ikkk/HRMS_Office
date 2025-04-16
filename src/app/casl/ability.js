import { Ability } from '@casl/ability';

export function defineRulesFor(user) {
  const rules = [];

  if (user?.role === 'admin') {
    // Admin can manage everything
    rules.push({ action: 'manage', subject: 'all' });
  } else if (user?.role === 'employee') {
    // Employee can read the Dashboard and Profile
    rules.push({ action: 'read', subject: 'Dashboard' });
    rules.push({ action: 'read', subject: 'Profile' });
    rules.push({ action: 'update', subject: 'OwnProfile', conditions: { userId: user.id } });
  }

  return new Ability(rules); // Return an Ability object
}
