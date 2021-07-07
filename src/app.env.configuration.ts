export const appEnvironmentConfiguration = () => ({
  app: {
    session: {
      secret: process.env.EXPRESS_SESSION_SECRET,
    },
    environment: process.env.NODE_ENV || 'development',
    port: process.env.SERVER_PORT || 3000,
    baseUrl: process.env.APP_BASE_URL || '/',
  },
});
