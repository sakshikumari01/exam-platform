const express = require('express');
const router = express.Router();
const QuestionBank = require('../models/QuestionBank');
const authMiddleware = require('../middleware/auth');

// Question add karo bank mein
router.post('/add', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only teacher can add questions!' });
    }

    const { question, options, correctAnswer, marks, negativeMark, timeLimit, subject } = req.body;

    const q = await QuestionBank.create({
      teacher: req.user.id,
      question,
      options,
      correctAnswer,
      marks,
      negativeMark,
      timeLimit,
      subject
    });

    res.status(201).json({ message: 'Question added to bank!', question: q });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Teacher ke saare questions dekho
router.get('/my-questions', authMiddleware, async (req, res) => {
  try {
    const questions = await QuestionBank.find({ teacher: req.user.id });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Question delete karo
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await QuestionBank.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;