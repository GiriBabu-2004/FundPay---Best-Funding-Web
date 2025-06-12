export const isAdmin = (user) => {
  return user && user.role === 'admin';
};
