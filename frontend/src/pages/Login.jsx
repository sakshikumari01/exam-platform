import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);

      const role = res.data.user.role;
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password!');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '12px', background: '#1a1a1a' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '40px' }}>🎓</div>
        <h1 style={{ margin: '10px 0', fontSize: '24px' }}>Login</h1>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', boxSizing: 'border-box' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '6px', boxSizing: 'border-box' }}
        />
        <button
          onClick={handleSubmit}
          style={{ width: '100%', padding: '12px', background: '#1a56db', color: 'white', borderRadius: '8px', border: 'none', fontSize: '16px', cursor: 'pointer' }}
        >
          Login
        </button>
      </div>

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Don't have an account?{' '}
        <span
          onClick={() => navigate('/register')}
          style={{ color: '#1a56db', cursor: 'pointer' }}
        >
          Register here
        </span>
      </p>
    </div>
  );
};

export default Login;