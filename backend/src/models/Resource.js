const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resource = sequelize.define('Resource', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  category: {
    type: DataTypes.ENUM('tutoring', 'office_hours', 'club', 'event', 'service', 'other'),
    allowNull: false
  },
  location: { type: DataTypes.STRING },
  schedule: { type: DataTypes.STRING },
  contact: { type: DataTypes.STRING },
  website: { type: DataTypes.STRING },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  approved: { type: DataTypes.BOOLEAN, defaultValue: true },
  avgRating: { type: DataTypes.FLOAT, defaultValue: 0 },
  reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  createdBy: { type: DataTypes.UUID, references: { model: 'Users', key: 'id' } }
}, { timestamps: true });

module.exports = Resource;
