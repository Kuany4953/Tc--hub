const { Op } = require('sequelize');
const { Resource, User, Bookmark } = require('../models');

const getAll = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const where = { approved: true };
    if (category) where.category = category;
    if (search) {
      const term = `%${search}%`;
      where[Op.or] = [
        { title: { [Op.like]: term } },
        { description: { [Op.like]: term } },
        { tags: { [Op.like]: `%${search.toLowerCase()}%` } }
      ];
    }
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Resource.findAndCountAll({
      where, limit: parseInt(limit), offset,
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ resources: rows, total: count, pages: Math.ceil(count / limit), page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }]
    });
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { title, description, category, location, schedule, contact, website, tags } = req.body;
    if (!title || !description || !category) return res.status(400).json({ error: 'Title, description, and category are required' });
    const resource = await Resource.create({
      title, description, category, location, schedule, contact, website,
      tags: tags || [], createdBy: req.user.id
    });
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Not found' });
    if (resource.createdBy !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Forbidden' });
    await resource.update(req.body);
    res.json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Not found' });
    if (resource.createdBy !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Forbidden' });
    await resource.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
