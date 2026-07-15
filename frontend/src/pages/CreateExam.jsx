import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CreateExam = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [examPassword, setExamPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 1,
      negativeMark: 0.25,
      timeLimit: 0
    }
  ]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 1,
      negativeMark: 0.25,
      timeLimit: 0
    }]);
  };

  const removeQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!title) {
      alert('Please fill exam title!');
      return;
    }
    if (!duration) {
      alert('Please fill duration!');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/exam/create', {
        title,
        description,
        duration: Number(duration),
        questions,
        examPassword: examPassword || null
      });
      console.log('Success:', res.data);
      alert('Exam created successfully!');
      navigate('/teacher-dashboard');
    } catch (err) {
      console.log('Error details:', err.response?.data);
      alert(`Error: ${err.response?.data?.message || err.message || 'Something went wrong!'}`);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'teacher' && user?.role !== 'admin') {
    return <h2>Access Denied!</h2>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Create New Exam</h1>
        <button
          type="button"
          onClick={() => navigate('/teacher-dashboard')}
          style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
        >
          ← Back
        </button>
      </div>

      <input
        type="text"
        placeholder="Exam Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', boxSizing: 'border-box' }}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', boxSizing: 'border-box' }}
      />
      <input
        type="number"
        placeholder="Duration (minutes) *"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', boxSizing: 'border-box' }}
      />
      <input
        type="text"
        placeholder="Exam Password (optional)"
        value={examPassword}
        onChange={(e) => setExamPassword(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '6px', boxSizing: 'border-box', border: '1px solid #6a1b9a' }}
      />

      {questions.map((q, i) => (
        <div key={i} style={{ border: '1px solid #333', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Question {i + 1}</h3>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(i)}
                style={{ padding: '5px 10px', background: 'red', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              >
                Remove
              </button>
            )}
          </div>

          <input
            type="text"
            placeholder="Question *"
            value={q.question}
            onChange={(e) => handleQuestionChange(i, 'question', e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '6px', boxSizing: 'border-box' }}
          />

          {q.options.map((opt, j) => (
            <input
              key={j}
              type="text"
              placeholder={`Option ${j + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(i, j, e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '5px', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          ))}

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
            <div>
              <label>Correct Answer (0-3): </label>
              <input
                type="number" min="0" max="3"
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(i, 'correctAnswer', Number(e.target.value))}
                style={{ width: '60px', padding: '8px', borderRadius: '6px' }}
              />
            </div>
            <div>
              <label>Marks: </label>
              <input
                type="number" min="1"
                value={q.marks}
                onChange={(e) => handleQuestionChange(i, 'marks', Number(e.target.value))}
                style={{ width: '60px', padding: '8px', borderRadius: '6px' }}
              />
            </div>
            <div>
              <label>Negative Mark: </label>
              <input
                type="number" min="0" step="0.25"
                value={q.negativeMark}
                onChange={(e) => handleQuestionChange(i, 'negativeMark', Number(e.target.value))}
                style={{ width: '70px', padding: '8px', borderRadius: '6px' }}
              />
            </div>
            <div>
              <label>Time Limit (sec): </label>
              <input
                type="number" min="0"
                value={q.timeLimit}
                onChange={(e) => handleQuestionChange(i, 'timeLimit', Number(e.target.value))}
                style={{ width: '70px', padding: '8px', borderRadius: '6px' }}
              />
            </div>
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button
          type="button"
          onClick={addQuestion}
          style={{ flex: 1, padding: '12px', background: '#1a56db', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}
        >
          + Add Question
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          style={{ flex: 1, padding: '12px', background: loading ? '#555' : '#2e7d32', color: 'white', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px' }}
        >
          {loading ? 'Creating...' : 'Create Exam ✅'}
        </button>
      </div>
    </div>
  );
};

export default CreateExam;