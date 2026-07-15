const mongoose = require('mongoose');

const questionBankSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  marks: { type: Number, default: 1 },
  negativeMark: { type: Number, default: 0.25 },
  timeLimit: { type: Number, default: 0 },
  subject: { type: String, default: 'General' }
}, { timestamps: true });

module.exports = mongoose.model('QuestionBank', questionBankSchema);