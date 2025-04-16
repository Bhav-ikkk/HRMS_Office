// src/app/casl/defineAbilities.client.js
'use client';
import { createMongoAbility } from '@casl/ability';
import defineRulesFor from './ability';

export function defineAbilitiesFor(user) {
  return createMongoAbility(defineRulesFor(user));
}
