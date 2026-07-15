import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Kuch gadbad ho gayi!');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>;

  return (
    <div style={{ padding: '30px', color: 'white' }}>
      <h1>Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', minWidth: '150px' }}>
          <h3>Total Students</h3>
          <p style={{ fontSize: '28px' }}>{stats.totalStudents}</p>
        </div>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', minWidth: '150px' }}>
          <h3>Total Teachers</h3>
          <p style={{ fontSize: '28px' }}>{stats.totalTeachers}</p>
        </div>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', minWidth: '150px' }}>
          <h3>Total Exams</h3>
          <p style={{ fontSize: '28px' }}>{stats.totalExams}</p>
        </div>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', minWidth: '150px' }}>
          <h3>Total Results</h3>
          <p style={{ fontSize: '28px' }}>{stats.totalResults}</p>
        </div>
      </div>

      <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
        <button onClick={() => navigate('/admin-users')} style={btnStyle}>Manage Users</button>
        <button onClick={() => navigate('/admin-exams')} style={btnStyle}>Manage Exams</button>
      </div>
    </div>
  );
};

const btnStyle = {
  padding: '12px 20px',
  background: '#7c3aed',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px'
};

export default AdminDashboard;