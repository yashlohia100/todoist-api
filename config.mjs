const config = {
  PORT: process.env.PORT,
  DATABASE_URI_LOCAL: process.env.DATABASE_URI_LOCAL,
  DATABASE_URI: process.env.DATABASE_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  COOKIE_EXPIRES_IN: process.env.COOKIE_EXPIRES_IN,
  FRONTEND_URL: process.env.FRONTEND_URL,
};

export default config;
