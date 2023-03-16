//Mongoose config
const mongoose = require('mongoose');
const server = require('./app');

require('dotenv').config();
const { API_VERSION, SERVER_IP, DB_PORT, SERVER_PORT } = require('./config');

(async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connection to database succeeded\n');

    server.listen(SERVER_PORT, () => {
      console.log('API REST BOOKSTER');
      console.log('-----------------\n');
      console.log(`API Version:${API_VERSION}`);
      console.log(`Server IP:${SERVER_IP}`);
      console.log(`Server port:${SERVER_PORT}`);
      console.log(`\n${SERVER_IP}:${SERVER_PORT}/api/${API_VERSION}`);
      console.log('\n Bookster');
      console.log('\n Welcome back!');
    });
  } catch (err) {
    console.error('Connection to database failed', err);
  }
})();
