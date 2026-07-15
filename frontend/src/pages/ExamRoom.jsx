import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const ExamRoom = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [activityLog, setActivityLog] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const videoRef = useRef(null);

  // ID verification check — COMPULSORY
  useEffect(() => {
    const isVerified = sessionStorage.getItem(`verified_${examId}`);
    if (!isVerified) {
      alert('⚠️ Pehle ID verify karo! Exam direct start nahi kar sakte!');
      navigate(`/verify/${examId}`);
    }
  }, [examId, navigate]);

  // Fetch exam
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await API.get(`/exam/${examId}`);
        setExam(res.data);
        setTimeLeft(res.data.duration * 60);
        setAnswers(res.data.questions.map((_, i) => ({
          questionIndex: i,
          selectedAnswer: -1
        })));
      } catch (err) {
        setFetchError('Yeh exam nahi mila! Ho sakta hai delete ho gaya ho.');
      }
    };
    fetchExam();
  }, [examId]);

  // Full screen
  useEffect(() => {
    const enterFullScreen = () => {
      document.documentElement.requestFullscreen().catch(() => {});
    };
    enterFullScreen();

    const handleFullScreenExit = () => {
      if (!document.fullscreenElement) {
        setWarnings(prev => prev + 1);
        addLog('Full screen exit detected!');
        alert('Warning! Full screen se bahar mat jao!');
        document.documentElement.requestFullscreen().catch(() => {});
      }
    };
    document.addEventListener('fullscreenchange', handleFullScreenExit);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenExit);
  }, []);

  // Camera access
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        addLog('Camera and mic access granted');
      } catch (err) {
        alert('Camera aur Mic access do — exam ke liye zaroori hai!');
      }
    };
    startCamera();
  }, []);

  // Tab switch detection
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setWarnings(prev => prev + 1);
        addLog('Tab switch detected!');
        alert('Warning! Tab switch detected!');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Timer
  useEffect(() => {
    if (!exam) return;
    if (timeLeft <= 0 && !submitted) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, exam]);

  const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setActivityLog(prev => [...prev, `${time} — ${message}`]);
  };

  const handleAnswer = (questionIndex, selectedAnswer) => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.questionIndex === questionIndex ? { ...a, selectedAnswer } : a
      )
    );
  };

  const handleSubmit = async () => {
    if (submitted || !exam) return;
    setSubmitted(true);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    sessionStorage.removeItem(`verified_${examId}`);
    const timeTaken = exam.duration * 60 - timeLeft;
    try {
      const res = await API.post('/result/submit', {
        examId,
        answers,
        timeTaken,
        warnings,
        activityLog
      });
      navigate('/result', { state: res.data });
    } catch (err) {
      console.log('Submit error:', err);
    }
  };

  if (fetchError) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
        <h2>{fetchError}</h2>
        <button
          onClick={() => navigate('/exams')}
          style={{ padding: '10px 20px', marginTop: '15px', cursor: 'pointer' }}
        >
          ← Back to Exam List
        </button>
      </div>
    );
  }

  if (!exam) return <h2>Loading...</h2>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div style={{ padding: '20px' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          width: '150px',
          borderRadius: '10px',
          border: '2px solid green'
        }}
      />

      {warnings > 0 && (
        <div style={{
          background: 'red',
          color: 'white',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '10px'
        }}>
          ⚠️ Warnings: {warnings}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>{exam.title}</h1>
        <h2 style={{ color: timeLeft < 60 ? 'red' : 'green' }}>
          ⏱ {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </h2>
      </div>

      {exam.questions.map((q, i) => (
        <div key={i} style={{
          border: '1px solid #ccc',
          padding: '15px',
          marginBottom: '10px',
          borderRadius: '8px'
        }}>
          <h3>Q{i + 1}. {q.question}</h3>
          {q.options.map((option, j) => (
            <div key={j}>
              <input
                type="radio"
                name={`question-${i}`}
                onChange={() => handleAnswer(i, j)}
                checked={answers[i]?.selectedAnswer === j}
              />
              <label> {option}</label>
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        style={{ padding: '10px 20px', background: 'green', color: 'white' }}
      >
        Submit Exam
      </button>
    </div>
  );
};

export default ExamRoom;