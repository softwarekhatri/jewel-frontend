import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const VerifyEmailPage = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('Invalid verification link.'); return; }
    authAPI.verifyEmail(token)
      .then(res => {
        setStatus('success');
        setMessage(res.data.message || 'Your email has been verified successfully!');
      })
      .catch(err => {
        setStatus('error');
        setMessage(err?.response?.data?.message || 'Verification failed. The link may have expired.');
      });
  }, [token]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--cream)', padding: '24px',
    }}>
      <div style={{
        background: 'var(--white)', borderRadius: '12px', padding: '56px 48px',
        maxWidth: '460px', width: '100%', textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)', animation: 'slideUp 0.5s ease',
      }}>
        {status === 'loading' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <div className="spinner" style={{ margin: '0 auto' }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: 8 }}>Verifying...</h2>
            <p style={{ color: 'var(--mid-gray)', fontSize: 14 }}>Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(39,174,96,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px', fontSize: '2rem', color: '#27ae60',
            }}>✓</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: 12 }}>Email Verified!</h2>
            <p style={{ color: 'var(--mid-gray)', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>{message}</p>
            <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex' }}>
              Sign In to Your Account
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(231,76,60,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px', fontSize: '2rem', color: '#e74c3c',
            }}>✕</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: 12 }}>Verification Failed</h2>
            <p style={{ color: 'var(--mid-gray)', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>{message}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn btn-primary">Sign Up Again</Link>
              <Link to="/" className="btn btn-secondary">Go Home</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
