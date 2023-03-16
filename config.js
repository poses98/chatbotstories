require('dotenv').config();
//todo configuration file...
const API_VERSION = process.env.API_VERSION;
const SERVER_IP = process.env.SERVER_IP;
const DB_PORT = process.env.DB_PORT;
const SERVER_PORT = process.env.PORT || 3977;

module.exports = {
  API_VERSION,
  SERVER_IP,
  DB_PORT,
  SERVER_PORT,
};
