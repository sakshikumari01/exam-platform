const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  marks: { type: Number, default: 1 },
  negativeMark: { type: Number, default: 0 },
  timeLimit: { type: Number, default: 0 }
});

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [questionSchema],
  totalMarks: { type: Number, default: 0 },
  isActive: { type: Boolean, default: false },
  examPassword: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);