require('dotenv').config();

module.exports = {
  db: {
    dialect: 'mysql',
    host: process.env.MYSQL_HOST || 'localhost',
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DB || 'erp',
    logging: false,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refreshsupersecret',
    accessExpiresIn: '10m',
    refreshExpiresIn: '1d',
  },
}; 