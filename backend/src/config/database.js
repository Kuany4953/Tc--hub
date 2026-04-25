const { Sequelize } = require('sequelize');
const path = require('path');

const useSqlite = !process.env.DATABASE_URL || process.env.DB_DIALECT === 'sqlite';

const sequelize = useSqlite
  ? new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '..', '..', 'data.sqlite'),
      logging: false,
    })
  : new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: process.env.NODE_ENV === 'production'
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
    });

module.exports = sequelize;
