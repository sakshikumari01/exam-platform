import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const QuestionBank = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    marks: 1,
    negativeMark: 0.25,
    timeLimit: 0,
    subject: 'General'
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await API.get('/questionbank/my-questions');
      setQuestions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.question) {
      alert('Please enter question!');
      return;
    }
    try {
      await API.post('/questionbank/add', newQuestion);
      alert('Question added to bank!');
      setShowForm(false);
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        marks: 1,
        negativeMark: 0.25,
        timeLimit: 0,
        subject: 'General'
      });
      fetchQuestions();
    } catch (err) {
      alert('Error adding question!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this question?')) {
      await API.delete(`/questionbank/${id}`);
      fetchQuestions();
    }
  };

  if (user?.role !== 'teacher' && user?.role !== 'admin') {
    return <h2>Access Denied!</h2>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>📚 Question Bank</h1>
        <button onClick={() => navigate('/teacher-dashboard')} style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
          ← Back
        </button>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        style={{ padding: '12px 24px', background: '#1a56db', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', marginBottom: '20px' }}
      >
        {showForm ? 'Cancel' : '+ Add New Question'}
      </button>

      {showForm && (
        <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <h3>Add New Question</h3>

          <input
            placeholder="Subject"
            value={newQuestion.subject}
            onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', boxSizing: 'border-box' }}
          />
          <input
            placeholder="Question *"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', boxSizing: 'border-box' }}
          />

          {newQuestion.options.map((opt, j) => (
            <input
              key={j}
              placeholder={`Option ${j + 1}`}
              value={opt}
              onChange={(e) => {
                const updated = [...newQuestion.options];
                updated[j] = e.target.value;
                setNewQuestion({ ...newQuestion, options: updated });
              }}
              style={{ width: '100%', padding: '8px', marginBottom: '5px', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          ))}

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
            <div>
              <label>Correct Answer (0-3): </label>
              <input
                type="number" min="0" max="3"
                value={newQuestion.correctAnswer}
                onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: Number(e.target.value) })}
                style={{ width: '60px', padding: '8px', borderRadius: '6px' }}
              />
            </div>
            <div>
              <label>Marks: </label>
              <input
                type="number" min="1"
                value={newQuestion.marks}
                onChange={(e) => setNewQuestion({ ...newQuestion, marks: Number(e.target.value) })}
                style={{ width: '60px', padding: '8px', borderRadius: '6px' }}
              />
            </div>
            <div>
              <label>Negative Mark: </label>
              <input
                type="number" min="0" step="0.25"
                value={newQuestion.negativeMark}
                onChange={(e) => setNewQuestion({ ...newQuestion, negativeMark: Number(e.target.value) })}
                style={{ width: '70px', padding: '8px', borderRadius: '6px' }}
              />
            </div>
            <div>
              <label>Time Limit (sec): </label>
              <input
                type="number" min="0"
                value={newQuestion.timeLimit}
                onChange={(e) => setNewQuestion({ ...newQuestion, timeLimit: Number(e.target.value) })}
                style={{ width: '70px', padding: '8px', borderRadius: '6px' }}
              />
            </div>
          </div>

          <button
            onClick={handleAddQuestion}
            style={{ width: '100%', padding: '12px', background: '#2e7d32', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', marginTop: '15px' }}
          >
            Save to Question Bank ✅
          </button>
        </div>
      )}

      <h2>My Questions ({questions.length})</h2>
      {questions.length === 0 ? (
        <p>No questions in bank yet!</p>
      ) : (
        questions.map((q, index) => (
          <div key={q._id} style={{ border: '1px solid #333', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#888', margin: '0 0 5px 0', fontSize: '12px' }}>Subject: {q.subject}</p>
                <h4 style={{ margin: '0 0 10px 0' }}>Q{index + 1}. {q.question}</h4>
                {q.options.map((opt, j) => (
                  <p key={j} style={{
                    margin: '3px 0',
                    color: j === q.correctAnswer ? '#4caf50' : '#ccc'
                  }}>
                    {j === q.correctAnswer ? '✅' : '○'} {opt}
                  </p>
                ))}
                <p style={{ color: '#888', margin: '8px 0 0 0', fontSize: '12px' }}>
                  Marks: {q.marks} | Negative: {q.negativeMark} | Time: {q.timeLimit > 0 ? `${q.timeLimit}s` : 'No limit'}
                </p>
              </div>
              <button
                onClick={() => handleDelete(q._id)}
                style={{ padding: '6px 12px', background: 'red', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', marginLeft: '10px' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default QuestionBank;