
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const ExamAnalytics = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examRes, resultsRes] = await Promise.all([
          API.get(`/exam/${examId}`),
          API.get(`/result/leaderboard/${examId}`)
        ]);
        setExam(examRes.data);
        setResults(resultsRes.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchData();
  }, [examId]);

  if (loading) return <h2 style={{ textAlign: 'center', padding: '20px' }}>Loading...</h2>;

  const totalStudents = results.length;
  const passedStudents = results.filter(r => r.percentage >= 50).length;
  const failedStudents = totalStudents - passedStudents;
  const avgScore = totalStudents > 0
    ? (results.reduce((sum, r) => sum + r.score, 0) / totalStudents).toFixed(2)
    : 0;
  const avgPercentage = totalStudents > 0
    ? (results.reduce((sum, r) => sum + parseFloat(r.percentage), 0) / totalStudents).toFixed(2)
    : 0;
  const highestScore = totalStudents > 0 ? Math.max(...results.map(r => r.score)) : 0;
  const lowestScore = totalStudents > 0 ? Math.min(...results.map(r => r.score)) : 0;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/teacher-dashboard')}
        style={{ padding: '8px 16px', marginBottom: '20px', borderRadius: '6px', cursor: 'pointer' }}
      >
        ← Back to Dashboard
      </button>

      <h1>📊 Exam Analytics</h1>
      {exam && <h2 style={{ color: '#888' }}>{exam.title}</h2>}

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: '#1a3a1a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ color: '#4caf50', margin: 0 }}>Total Students</h3>
          <h1 style={{ color: 'white', margin: '10px 0' }}>{totalStudents}</h1>
        </div>
        <div style={{ background: '#1a2a3a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ color: '#2196f3', margin: 0 }}>Average Score</h3>
          <h1 style={{ color: 'white', margin: '10px 0' }}>{avgScore}</h1>
          <p style={{ color: '#888', margin: 0 }}>{avgPercentage}%</p>
        </div>
        <div style={{ background: '#2a1a1a', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ color: '#f44336', margin: 0 }}>Pass / Fail</h3>
          <h1 style={{ color: 'white', margin: '10px 0' }}>
            <span style={{ color: '#4caf50' }}>{passedStudents}</span>
            {' / '}
            <span style={{ color: '#f44336' }}>{failedStudents}</span>
          </h1>
        </div>
      </div>

      {/* Score Range */}
      <div style={{ background: '#1a1a2a', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h3>Score Range</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: '#888', margin: 0 }}>Highest Score</p>
            <h2 style={{ color: '#4caf50', margin: '5px 0' }}>{highestScore} / {exam?.totalMarks}</h2>
          </div>
          <div>
            <p style={{ color: '#888', margin: 0 }}>Lowest Score</p>
            <h2 style={{ color: '#f44336', margin: '5px 0' }}>{lowestScore} / {exam?.totalMarks}</h2>
          </div>
        </div>
      </div>

      {/* Pass/Fail Bar */}
      {totalStudents > 0 && (
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
          <h3>Pass Rate</h3>
          <div style={{ background: '#333', borderRadius: '8px', height: '30px', overflow: 'hidden' }}>
            <div style={{
              background: '#4caf50',
              width: `${(passedStudents / totalStudents) * 100}%`,
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {((passedStudents / totalStudents) * 100).toFixed(0)}%
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
            <span style={{ color: '#4caf50' }}>✅ Pass: {passedStudents}</span>
            <span style={{ color: '#f44336' }}>❌ Fail: {failedStudents}</span>
          </div>
        </div>
      )}

      {/* Student Results Table */}
      <h3>All Students Results</h3>
      {results.length === 0 ? (
        <p>No results yet!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#333' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Rank</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Student</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Score</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Percentage</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={result._id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '12px' }}>#{index + 1}</td>
                <td style={{ padding: '12px' }}>{result.student?.name}</td>
                <td style={{ padding: '12px' }}>{result.score} / {result.totalMarks}</td>
                <td style={{ padding: '12px' }}>{result.percentage}%</td>
                <td style={{ padding: '12px', color: result.percentage >= 50 ? '#4caf50' : '#f44336' }}>
                  {result.percentage >= 50 ? '✅ Pass' : '❌ Fail'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExamAnalytics;