const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false, // You might need to set this to true in production
  },
});

client.connect()
  .then(() => {
    console.log('Connected to the database successfully.');
    return client.end();
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
