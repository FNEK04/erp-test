const express = require('express');
const cors = require('cors');
const sequelize = require('./models/sequelize');
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Проверка подключения к базе
sequelize.authenticate()
  .then(() => console.log('DB connected'))
  .catch(err => console.error('DB connection error:', err));

sequelize.sync().then(() => {
  console.log('DB synced');
});

// TODO: routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/file'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app; 