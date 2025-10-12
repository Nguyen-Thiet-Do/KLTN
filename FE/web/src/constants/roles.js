// Role definitions
export const ROLES = {
  ADMIN: 1,
  LIBRARIAN: 2,
  READER: 3,
};

// Role names map
export const ROLE_NAMES = {
  1: 'Admin',
  2: 'Thủ thư',
  3: 'Độc giả',
};

// Get role name by ID
export const getRoleName = (roleId) => {
  return ROLE_NAMES[roleId] || 'Unknown';
};

// Check if user has specific role
export const hasRole = (userRoleId, requiredRole) => {
  return userRoleId === requiredRole;
};

// Check if user has any of the roles
export const hasAnyRole = (userRoleId, requiredRoles) => {
  return requiredRoles.includes(userRoleId);
};

// Check if user is admin
export const isAdmin = (userRoleId) => {
  return userRoleId === ROLES.ADMIN;
};

// Check if user is librarian
export const isLibrarian = (userRoleId) => {
  return userRoleId === ROLES.LIBRARIAN;
};

// Check if user is reader
export const isReader = (userRoleId) => {
  return userRoleId === ROLES.READER;
};