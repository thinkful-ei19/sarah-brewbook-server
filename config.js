'use strict';

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DATABASE_URL:
        process.env.DATABASE_URL || 'mongodb://localhost/brewbook',
  TEST_MONGODB_URI:
        process.env.TEST_MONGODB_URI || 'mongodb://localhost/brewbook-test',
  JWT_SECRET: 
        process.env.JWT_SECRET,
  JWT_EXPIRY:
        process.env.JWT_EXPIRY || '7d'
  // DATABASE_URL:
  //     process.env.DATABASE_URL || 'postgres://localhost/thinkful-backend',
  // TEST_DATABASE_URL:
  //     process.env.TEST_DATABASE_URL ||
  //     'postgres://localhost/thinkful-backend-test'
};
