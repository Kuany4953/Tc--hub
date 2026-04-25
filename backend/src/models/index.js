const sequelize = require('../config/database');
const User = require('./User');
const Resource = require('./Resource');
const { Bookmark, Review } = require('./Bookmark');

// Associations
User.hasMany(Resource, { foreignKey: 'createdBy', as: 'resources' });
Resource.belongsTo(User, { foreignKey: 'createdBy', as: 'author' });

User.hasMany(Bookmark, { foreignKey: 'userId' });
Bookmark.belongsTo(User, { foreignKey: 'userId' });
Bookmark.belongsTo(Resource, { foreignKey: 'resourceId' });
Resource.hasMany(Bookmark, { foreignKey: 'resourceId' });

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'reviewer' });
Resource.hasMany(Review, { foreignKey: 'resourceId', as: 'reviews' });
Review.belongsTo(Resource, { foreignKey: 'resourceId' });

module.exports = { sequelize, User, Resource, Bookmark, Review };
