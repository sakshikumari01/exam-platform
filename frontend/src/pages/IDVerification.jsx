import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Tesseract from 'tesseract.js';

const IDVerification = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [idType, setIdType] = useState('college_id');
  const [captured, setCaptured] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setCameraOn(true);
    } catch (err) {
      alert('Please allow camera access!');
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const photo = canvas.toDataURL('image/jpeg');
    setCaptured(photo);
    streamRef.current.getTracks().forEach(track => track.stop());
    setCameraOn(false);
  };

  const handleSubmit = async () => {
    if (!captured) {
      alert('Please take a photo of your ID card first!');
      return;
    }

    setUploading(true);
    setVerifyMessage('Scanning ID card... Please wait!');
    setProgress(0);

    try {
      const result = await Tesseract.recognize(
        captured,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );

      const detectedText = result.data.text.toLowerCase();
      console.log('Detected text:', detectedText);

      if (detectedText.trim().length > 20) {
        setVerifyMessage('ID Verified! Starting exam...');
        sessionStorage.setItem(`verified_${examId}`, 'true');
        setTimeout(() => {
          navigate(`/exam/${examId}`);
        }, 1500);
      } else {
        setVerifyMessage('Could not detect text on ID card. Please hold your ID card closer and try again!');
        setCaptured(null);
        setUploading(false);
        setProgress(0);
      }
    } catch (err) {
      setVerifyMessage('Verification failed! Please try again!');
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '50px auto',
      padding: '30px',
      border: '1px solid #ccc',
      borderRadius: '12px',
      background: '#1a1a1a'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '50px', marginBottom: '8px' }}>🪪</div>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Identity Verification</h1>
      </div>

      <div style={{
        background: '#2d1a1a',
        border: '1px solid red',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <p style={{ color: 'red', fontWeight: 'bold', margin: 0, textAlign: 'center' }}>
          A valid ID card is COMPULSORY. Exam will not start without ID verification!
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Select ID Type:</label>
        <select
          value={idType}
          onChange={(e) => setIdType(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '6px' }}
        >
          <option value="aadhar">Aadhar Card</option>
          <option value="college_id">College ID</option>
          <option value="school_id">School ID</option>
          <option value="driving_license">Driving License</option>
        </select>
      </div>

      {!captured && (
        <div style={{ marginBottom: '20px' }}>
          <video
            ref={videoRef}
            autoPlay
            style={{
              width: '100%',
              borderRadius: '8px',
              display: cameraOn ? 'block' : 'none',
              marginBottom: '10px'
            }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {!cameraOn ? (
            <button
              onClick={startCamera}
              style={{
                width: '100%',
                padding: '12px',
                background: '#1a56db',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Turn On Camera
            </button>
          ) : (
            <button
              onClick={capturePhoto}
              style={{
                width: '100%',
                padding: '12px',
                background: '#e37400',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Capture ID Card Photo
            </button>
          )}
        </div>
      )}

      {captured && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: 'green' }}>Photo captured!</p>
          <img
            src={captured}
            alt="ID"
            style={{ width: '100%', borderRadius: '8px' }}
          />
          <button
            onClick={() => { setCaptured(null); setVerifyMessage(''); setProgress(0); }}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '10px',
              background: '#555',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Retake Photo
          </button>
        </div>
      )}

      {uploading && progress > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <p style={{ color: 'white', marginBottom: '5px' }}>Scanning: {progress}%</p>
          <div style={{ background: '#333', borderRadius: '8px', height: '10px' }}>
            <div style={{
              background: 'green',
              width: `${progress}%`,
              height: '10px',
              borderRadius: '8px',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
      )}

      {verifyMessage && (
        <div style={{
          padding: '12px',
          marginBottom: '15px',
          borderRadius: '8px',
          background: verifyMessage.includes('Verified') ? '#1a3a1a' : '#3a1a1a',
          color: verifyMessage.includes('Verified') ? '#4caf50' : '#f44336',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {verifyMessage}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={uploading || !captured}
        style={{
          width: '100%',
          padding: '12px',
          background: uploading || !captured ? '#555' : '#2e7d32',
          color: 'white',
          borderRadius: '8px',
          border: 'none',
          fontSize: '16px',
          cursor: uploading || !captured ? 'not-allowed' : 'pointer'
        }}
      >
        {uploading ? `Verifying ID... ${progress}%` : !captured ? 'Please Capture ID First' : 'Verify & Start Exam'}
      </button>
    </div>
  );
};

export default IDVerification;