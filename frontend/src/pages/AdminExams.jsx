import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const AdminExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchExams = async () => {
    try {
      const res = await API.get('/admin/exams');
      setExams(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Kuch gadbad ho gayi!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(`Kya tum "${title}" exam ko delete karna chahti ho?`);
    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/exams/${id}`);
      alert('Exam deleted successfully!');
      fetchExams(); // list refresh karo
    } catch (err) {
      alert(err.response?.data?.message || 'Delete nahi ho paya!');
    }
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>;

  return (
    <div style={{ padding: '30px', color: 'white' }}>
      <button onClick={() => navigate('/admin-dashboard')} style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}>
        ← Back to Dashboard
      </button>

      <h1>Manage Exams</h1>

      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#1e293b' }}>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Teacher</th>
            <th style={thStyle}>Duration</th>
            <th style={thStyle}>Total Marks</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((e) => (
            <tr key={e._id} style={{ borderBottom: '1px solid #334155' }}>
              <td style={tdStyle}>{e.title}</td>
              <td style={tdStyle}>{e.teacher?.name || 'N/A'}</td>
              <td style={tdStyle}>{e.duration} min</td>
              <td style={tdStyle}>{e.totalMarks}</td>
              <td style={tdStyle}>
                <button
                  onClick={() => handleDelete(e._id, e.title)}
                  style={{ background: '#dc2626', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {exams.length === 0 && <p style={{ marginTop: '20px' }}>Koi exam nahi mila.</p>}
    </div>
  );
};

const thStyle = { padding: '12px', textAlign: 'left' };
const tdStyle = { padding: '12px' };

export default AdminExams;