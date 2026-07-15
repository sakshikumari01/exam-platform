import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Leaderboard = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get(`/result/leaderboard/${examId}`);
        setResults(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [examId]);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🏆 Leaderboard</h1>

      {results.length === 0 ? (
        <p>Abhi koi result nahi hai!</p>
      ) : (
        results.map((result, index) => (
          <div key={result._id} style={{
            border: '1px solid #ccc',
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'transparent'
          }}>
            <div>
              <h3>#{index + 1} {result.student?.name}</h3>
              <p>{result.student?.email}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2>{result.score} / {result.totalMarks}</h2>
              <p>{result.percentage}%</p>
            </div>
          </div>
        ))
      )}

      <button
        onClick={() => navigate('/exams')}
        style={{ padding: '12px 20px', marginTop: '20px' }}
      >
        Back to Exams
      </button>
    </div>
  );
};

export default Leaderboard;