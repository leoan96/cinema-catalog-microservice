export const mongooseEnvironmentConfiguration = () => ({
  mongoose: {
    uri: process.env.MONGO_DATABASE_URI,
  },
});
