import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [passwordInput, setPasswordInput] = useState({});
  const [passwordError, setPasswordError] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      const res = await API.get('/exam/all');
      setExams(res.data);
    };
    fetchExams();
  }, []);

  const handleStartExam = async (exam) => {
    if (exam.examPassword) {
      const enteredPassword = passwordInput[exam._id];
      if (!enteredPassword) {
        setPasswordError({ ...passwordError, [exam._id]: 'Please enter exam password!' });
        return;
      }
      try {
        const res = await API.post(`/exam/verify-password/${exam._id}`, { password: enteredPassword });
        if (!res.data.verified) {
          setPasswordError({ ...passwordError, [exam._id]: 'Incorrect password!' });
          return;
        }
      } catch (err) {
        setPasswordError({ ...passwordError, [exam._id]: 'Error verifying password!' });
        return;
      }
    }
    navigate(`/verify/${exam._id}`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Available Exams</h1>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
          ← Back
        </button>
      </div>

      {exams.length === 0 ? (
        <p>No exams available!</p>
      ) : (
        exams.map((exam) => (
          <div key={exam._id} style={{
            border: '1px solid #333',
            padding: '20px',
            marginBottom: '15px',
            borderRadius: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>{exam.title} {exam.examPassword ? '🔒' : '🔓'}</h3>
                <p style={{ margin: '0 0 5px 0', color: '#888' }}>{exam.description}</p>
                <p style={{ margin: 0, color: '#888' }}>
                  Duration: {exam.duration} min | Total Marks: {exam.totalMarks} | Questions: {exam.questions.length}
                </p>
              </div>
            </div>

            {exam.examPassword && (
              <div style={{ marginTop: '15px' }}>
                <input
                  type="password"
                  placeholder="Enter exam password 🔒"
                  value={passwordInput[exam._id] || ''}
                  onChange={(e) => setPasswordInput({ ...passwordInput, [exam._id]: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', marginBottom: '8px', boxSizing: 'border-box', border: '1px solid #6a1b9a' }}
                />
                {passwordError[exam._id] && (
                  <p style={{ color: 'red', margin: '0 0 8px 0' }}>{passwordError[exam._id]}</p>
                )}
              </div>
            )}

            <button
              onClick={() => handleStartExam(exam)}
              style={{
                marginTop: '15px',
                padding: '10px 20px',
                background: '#1a56db',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              {exam.examPassword ? '🔒 Enter Password & Start' : 'Start Exam →'}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ExamList;