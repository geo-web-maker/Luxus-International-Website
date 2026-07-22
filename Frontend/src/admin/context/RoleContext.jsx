import { useState, useCallback } from 'react';
import { RoleContext } from './role-context-instance';
import { ROLES } from '../data/roles';

export function RoleProvider({ children }) {
  const [roleKey, setRoleKey] = useState(() => localStorage.getItem('sachi_demo_role') || null);

  const signInAs = useCallback((key) => {
    localStorage.setItem('sachi_demo_role', key);
    setRoleKey(key);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('sachi_demo_role');
    setRoleKey(null);
  }, []);

  const role = roleKey ? ROLES[roleKey] : null;

  const hasAccess = useCallback(
    (section) => Boolean(role && role.sections.includes(section)),
    [role],
  );

  return (
    <RoleContext.Provider value={{ roleKey, role, signInAs, signOut, hasAccess }}>
      {children}
    </RoleContext.Provider>
  );
}
