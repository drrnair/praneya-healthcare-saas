// Development utilities to bypass complex requirements
export const connectDatabase = async () => {
  console.log('🔄 Database connection (dev mode - skipped)');
  return { status: 'dev-mode' };
};

export const initializeRedis = async () => {
  console.log('🔄 Redis connection (dev mode - skipped)');
  return { status: 'dev-mode' };
};
