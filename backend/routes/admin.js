const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Exam = require('../models/Exam');
const Result = require('../models/Result');
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Dashboard stats
router.get('/stats', authMiddleware, adminAuth, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalExams = await Exam.countDocuments();
    const totalResults = await Result.countDocuments();

    res.json({
      totalStudents,
      totalTeachers,
      totalExams,
      totalResults
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Saare users ki list (students + teachers)
router.get('/users', authMiddleware, adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// User delete karo
router.delete('/users/:id', authMiddleware, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User nahi mila!' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admin ko delete nahi kar sakte!' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Saare exams ki list (sabhi teachers ke)
router.get('/exams', authMiddleware, adminAuth, async (req, res) => {
  try {
    const exams = await Exam.find().populate('teacher', 'name email');
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Exam delete karo
router.delete('/exams/:id', authMiddleware, adminAuth, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam nahi mila!' });
    }
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;