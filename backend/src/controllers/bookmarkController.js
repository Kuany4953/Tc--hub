const { Bookmark, Resource, User } = require('../models');

const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.findAll({
      where: { userId: req.user.id },
      include: [{ model: Resource, include: [{ model: User, as: 'author', attributes: ['id', 'name'] }] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(bookmarks.map(b => b.Resource));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addBookmark = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.resourceId);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    const [bookmark, created] = await Bookmark.findOrCreate({
      where: { userId: req.user.id, resourceId: req.params.resourceId }
    });
    res.status(created ? 201 : 200).json({ bookmarked: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeBookmark = async (req, res) => {
  try {
    const deleted = await Bookmark.destroy({
      where: { userId: req.user.id, resourceId: req.params.resourceId }
    });
    res.json({ bookmarked: false, deleted: deleted > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStatus = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ where: { userId: req.user.id, resourceId: req.params.resourceId } });
    res.json({ bookmarked: !!bookmark });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getBookmarks, addBookmark, removeBookmark, getStatus };
