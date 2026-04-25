const express = require('express');
const { register, login, me } = require('../controllers/authController');
const { getAll, getOne, create, update, remove } = require('../controllers/resourceController');
const { getBookmarks, addBookmark, removeBookmark, getStatus } = require('../controllers/bookmarkController');
const { getReviews, addReview, deleteReview } = require('../controllers/reviewController');
const { auth, adminOnly } = require('../middleware/auth');
const { User, Resource } = require('../models');

const router = express.Router();

// Auth
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', auth, me);

// Resources
router.get('/resources', getAll);
router.get('/resources/:id', getOne);
router.post('/resources', auth, create);
router.put('/resources/:id', auth, update);
router.delete('/resources/:id', auth, remove);

// Bookmarks
router.get('/bookmarks', auth, getBookmarks);
router.get('/bookmarks/status/:resourceId', auth, getStatus);
router.post('/bookmarks/:resourceId', auth, addBookmark);
router.delete('/bookmarks/:resourceId', auth, removeBookmark);

// Reviews
router.get('/reviews/:resourceId', getReviews);
router.post('/reviews/:resourceId', auth, addReview);
router.delete('/reviews/:id', auth, deleteReview);

// Admin
router.get('/admin/users', auth, adminOnly, async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']] });
  res.json(users);
});
router.get('/admin/stats', auth, adminOnly, async (req, res) => {
  const [userCount, resourceCount] = await Promise.all([User.count(), Resource.count()]);
  res.json({ userCount, resourceCount });
});
router.patch('/admin/resources/:id/approve', auth, adminOnly, async (req, res) => {
  const r = await Resource.findByPk(req.params.id);
  if (!r) return res.status(404).json({ error: 'Not found' });
  await r.update({ approved: true });
  res.json(r);
});

module.exports = router;
