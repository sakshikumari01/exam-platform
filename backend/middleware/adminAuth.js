const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied! Sirf admin allowed hai.' });
  }
  next();
};

module.exports = adminAuth;