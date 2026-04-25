const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: {
    type: DataTypes.STRING, allowNull: false, unique: true,
    validate: {
      isEmail: true,
      isTrinityEmail(value) {
        if (!value.endsWith('@trincoll.edu') && !value.endsWith('@gmail.com')) {
          throw new Error('Must use a Trinity College email (@trincoll.edu)');
        }
      }
    }
  },
  password: { type: DataTypes.STRING, allowNull: false },
  major: { type: DataTypes.STRING },
  year: { type: DataTypes.ENUM('2025', '2026', '2027', '2028', 'Faculty', 'Staff') },
  role: { type: DataTypes.ENUM('student', 'admin'), defaultValue: 'student' },
  avatar: { type: DataTypes.STRING }
}, { timestamps: true });

module.exports = User;
