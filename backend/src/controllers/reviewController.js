const { Review, User, Resource } = require('../models');

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { resourceId: req.params.resourceId },
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating) return res.status(400).json({ error: 'Rating is required' });
    const resource = await Resource.findByPk(req.params.resourceId);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    const existing = await Review.findOne({ where: { userId: req.user.id, resourceId: req.params.resourceId } });
    if (existing) return res.status(409).json({ error: 'You already reviewed this resource' });
    const review = await Review.create({ userId: req.user.id, resourceId: req.params.resourceId, rating, comment });

    // Recalculate avg rating
    const all = await Review.findAll({ where: { resourceId: req.params.resourceId } });
    const avg = all.reduce((sum, r) => sum + r.rating, 0) / all.length;
    await resource.update({ avgRating: Math.round(avg * 10) / 10, reviewCount: all.length });

    const withUser = await Review.findByPk(review.id, {
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'name', 'avatar'] }]
    });
    res.status(201).json(withUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: 'Not found' });
    if (review.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    await review.destroy();

    // Recalculate avg
    const resource = await Resource.findByPk(review.resourceId);
    const all = await Review.findAll({ where: { resourceId: review.resourceId } });
    const avg = all.length ? all.reduce((sum, r) => sum + r.rating, 0) / all.length : 0;
    await resource.update({ avgRating: Math.round(avg * 10) / 10, reviewCount: all.length });

    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getReviews, addReview, deleteReview };
