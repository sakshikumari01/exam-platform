const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const Exam = require('../models/Exam');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Email bhejo
const sendResultEmail = async (email, name, score, totalMarks, percentage) => {
  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL,
    subject: 'Exam Result — Online Exam Platform',
    html: `
      <h2>Hello ${name}! 👋</h2>
      <p>Tera exam result aa gaya!</p>
      <h3>Score: ${score} / ${totalMarks}</h3>
      <h3>Percentage: ${percentage}%</h3>
      <h3 style="color: ${percentage >= 50 ? 'green' : 'red'}">
        ${percentage >= 50 ? '✅ Pass!' : '❌ Fail!'}
      </h3>
      <p>Online Exam Platform</p>
    `
  };
  await sgMail.send(msg);
};

// Exam submit karo
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { examId, answers, timeTaken, warnings, activityLog } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam nahi mila!' });
    }

    let score = 0;
    answers.forEach((answer) => {
      const question = exam.questions[answer.questionIndex];
      if (answer.selectedAnswer === question.correctAnswer) {
        score += question.marks;
      } else if (answer.selectedAnswer !== -1) {
        score -= question.negativeMark;
      }
    });

    if (score < 0) score = 0;

    const percentage = (score / exam.totalMarks) * 100;

    const result = await Result.create({
      exam: examId,
      student: req.user.id,
      answers,
      score,
      totalMarks: exam.totalMarks,
      percentage: percentage.toFixed(2),
      timeTaken
    });

    try {
      const student = await User.findById(req.user.id);
      await sendResultEmail(
        student.email,
        student.name,
        score,
        exam.totalMarks,
        percentage.toFixed(2)
      );
      console.log('Email sent successfully!');
    } catch (emailErr) {
      console.log('Email error:', emailErr.message);
    }

    res.status(201).json({
      message: 'Exam submitted!',
      score,
      totalMarks: exam.totalMarks,
      percentage: percentage.toFixed(2),
      examId: examId,
      warnings: warnings || 0,
      activityLog: activityLog || []
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Leaderboard
router.get('/leaderboard/:examId', authMiddleware, async (req, res) => {
  try {
    const results = await Result.find({ exam: req.params.examId })
      .populate('student', 'name email')
      .sort({ score: -1 });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Student ka apna result
router.get('/my-results', authMiddleware, async (req, res) => {
  try {
    const results = await Result.find({ student: req.user.id })
      .populate('exam', 'title totalMarks');

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;