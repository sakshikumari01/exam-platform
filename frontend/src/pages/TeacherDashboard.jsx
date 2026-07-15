import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      const res = await API.get('/exam/all');
      setExams(res.data);
    };
    fetchExams();
  }, []);

  if (user?.role !== 'teacher' && user?.role !== 'admin') {
    return <h2>Access Denied!</h2>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Teacher Dashboard 📊</h1>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
        >
          ← Back
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/create-exam')}
          style={{ padding: '12px 24px', background: '#1a56db', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          + Create New Exam
        </button>
        <button
          onClick={() => navigate('/question-bank')}
          style={{ padding: '12px 24px', background: '#6a1b9a', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          📚 Question Bank
        </button>
      </div>

      <h2>All Exams</h2>
      {exams.length === 0 ? (
        <p>No exams created yet!</p>
      ) : (
        exams.map((exam) => (
          <div key={exam._id} style={{
            border: '1px solid #333',
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>
                {exam.title} {exam.examPassword ? '🔒' : '🔓'}
              </h3>
              <p style={{ margin: 0, color: '#888' }}>
                Duration: {exam.duration} min | Total Marks: {exam.totalMarks} | Questions: {exam.questions.length}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => navigate(`/leaderboard/${exam._id}`)}
                style={{ padding: '8px 12px', background: '#2e7d32', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              >
                🏆 Leaderboard
              </button>
              <button
                onClick={() => navigate(`/analytics/${exam._id}`)}
                style={{ padding: '8px 12px', background: '#6a1b9a', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              >
                📊 Analytics
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TeacherDashboard;