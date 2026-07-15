const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const auth = require('../middleware/auth');

// Create Exam
router.post('/create', auth, async (req, res) => {
  try {
    const { title, description, duration, questions, examPassword } = req.body;

    const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);

    const exam = new Exam({
      title,
      description,
      duration,
      teacher: req.user.id,
      questions,
      totalMarks,
      examPassword: examPassword || null
    });

    await exam.save();
    res.status(201).json({ message: 'Exam created successfully', exam });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get exams — teacher sees own exams, student sees all exams
router.get('/all', auth, async (req, res) => {
  try {
    let exams;
    if (req.user.role === 'teacher') {
      exams = await Exam.find({ teacher: req.user.id });
    } else {
      exams = await Exam.find();
    }
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Exam password verify karo
router.post('/verify-password/:id', auth, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found!' });
    }

    if (!exam.examPassword) {
      return res.json({ verified: true, message: 'No password required!' });
    }

    if (exam.examPassword === req.body.password) {
      return res.json({ verified: true, message: 'Password correct!' });
    } else {
      return res.json({ verified: false, message: 'Incorrect password!' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Single exam dekho
router.get('/:id', auth, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found!' });
    }
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;