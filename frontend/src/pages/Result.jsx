import { useLocation, useNavigate } from 'react-router-dom';

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Exam Submitted! 🎉</h1>

      {/* Score Card */}
      <div style={{
        border: '1px solid #ccc',
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h2>Your Score</h2>
        <h1 style={{ color: 'green', fontSize: '48px' }}>
          {state?.score} / {state?.totalMarks}
        </h1>
        <h3>Percentage: {state?.percentage}%</h3>
        <p style={{ color: state?.percentage >= 50 ? 'green' : 'red', fontSize: '20px' }}>
          {state?.percentage >= 50 ? '✅ Pass!' : '❌ Fail!'}
        </p>
      </div>

      {/* Activity Log */}
      {state?.warnings > 0 && (
        <div style={{
          border: '1px solid red',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: 'red' }}>⚠️ Suspicious Activity Report</h3>
          <p>Total Warnings: {state?.warnings}</p>
          {state?.activityLog?.map((log, i) => (
            <p key={i} style={{ color: 'red', fontSize: '14px' }}>• {log}</p>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => navigate('/exams')}
          style={{ flex: 1, padding: '12px', borderRadius: '8px' }}
        >
          Back to Exams
        </button>
        <button
          onClick={() => navigate(`/leaderboard/${state?.examId}`)}
          style={{ flex: 1, padding: '12px', background: 'blue', color: 'white', borderRadius: '8px' }}
        >
          🏆 Leaderboard
        </button>
      </div>
    </div>
  );
};

export default Result;