const config = {
  port: process.env.PORT,
  db: {
    serviceAccountKey: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    storageBucket: process.env.STORAGE_BUCKET_URL,
  },

  authentication: {
    jwtSecret: process.env.JWT_SECRET,
  },
};
module.exports = config;
