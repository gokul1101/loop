require("dotenv").config();
module.exports = {
  DB: process.env.APP_DB,
  SECRET: process.env.APP_SECRET,
  PORT: process.env.APP_PORT,
  ENCRPYTION_KEY: process.env.APP_ENCRPYTION_KEY,
};
