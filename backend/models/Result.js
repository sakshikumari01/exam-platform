const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionIndex: { type: Number },
    selectedAnswer: { type: Number }
  }],
  score: { type: Number, default: 0 },
  totalMarks: { type: Number },
  percentage: { type: Number },
  timeTaken: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);