import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome, {user?.name}! 👋</h1>
      <p>Role: {user?.role}</p>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/exams')}
          style={{ padding: '10px 20px', borderRadius: '8px' }}
        >
          📝 View Exams
        </button>

        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <>
            <button
              onClick={() => navigate('/create-exam')}
              style={{ padding: '10px 20px', background: 'blue', color: 'white', borderRadius: '8px' }}
            >
              ➕ Create Exam
            </button>
            <button
              onClick={() => navigate('/teacher-dashboard')}
              style={{ padding: '10px 20px', background: 'purple', color: 'white', borderRadius: '8px' }}
            >
              📊 Teacher Dashboard
            </button>
          </>
        )}

        <button
          onClick={handleLogout}
          style={{ padding: '10px 20px', background: 'red', color: 'white', borderRadius: '8px' }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;