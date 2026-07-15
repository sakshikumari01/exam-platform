import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExamList from './pages/ExamList';
import ExamRoom from './pages/ExamRoom';
import Result from './pages/Result';
import CreateExam from './pages/CreateExam';
import IDVerification from './pages/IDVerification';
import Leaderboard from './pages/Leaderboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ExamAnalytics from './pages/ExamAnalytics';
import QuestionBank from './pages/QuestionBank';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminExams from './pages/AdminExams';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/exams" element={<ExamList />} />
          <Route path="/verify/:examId" element={<IDVerification />} />
          <Route path="/exam/:examId" element={<ExamRoom />} />
          <Route path="/result" element={<Result />} />
          <Route path="/create-exam" element={<CreateExam />} />
          <Route path="/leaderboard/:examId" element={<Leaderboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/analytics/:examId" element={<ExamAnalytics />} />
          <Route path="/question-bank" element={<QuestionBank />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-users" element={<AdminUsers />} />
          <Route path="/admin-exams" element={<AdminExams />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;