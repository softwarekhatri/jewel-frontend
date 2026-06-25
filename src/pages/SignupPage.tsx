import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPages.css';
import './LoginPage.css';
import './SignupPage.css';

interface Form { name: string; email: string; password: string; confirm: string; }
interface Errors { name?: string; email?: string; password?: string; confirm?: string; }

const getPasswordStrength = (p: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^a-zA-Z0-9]/.test(p)) score++;
  const map = [
    { score: 0, label: '', color: 'transparent' },
    { score: 1, label: 'Weak', color: '#e74c3c' },
    { score: 2, label: 'Fair', color: '#f39c12' },
    { score: 3, label: 'Good', color: '#27ae60' },
    { score: 4, label: 'Strong', color: '#27ae60' },
  ];
  return map[score];
};

const SignupPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const strength = getPasswordStrength(form.password);

  const validate = (): Errors => {
    const errs: Errors = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Enter your full name';
    if (!form.email.includes('@')) errs.email = 'Enter a valid email address';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name as keyof Errors]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(form.name.trim(), form.email, form.password);
      setSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page signup-success-page">
        <div className="signup-success">
          <div className="signup-success__icon">✉</div>
          <h2>Verify Your Email</h2>
          <p>
            We've sent a verification link to <strong>{form.email}</strong>.
            Please check your inbox and verify your email to continue.
          </p>
          <p className="signup-success__sub">Don't see it? Check your spam folder.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page signup-page">
      {/* Left */}
      <div className="auth-panel auth-panel--left signup-left">
        <div className="auth-panel__bg signup-bg" />
        <div className="auth-panel__overlay" />
        <div className="auth-panel__content">
          <Link to="/" className="auth-panel__logo">JewelRocX</Link>
          <h2 className="auth-panel__headline">Begin Your Jewellery Journey</h2>
          <p className="auth-panel__sub">
            Create your account and unlock access to our exclusive collections,
            personalised recommendations, and member-only offers.
          </p>
          <div className="auth-panel__perks">
            <div className="auth-perk">✦ Exclusive member discounts</div>
            <div className="auth-perk">✦ Order tracking & history</div>
            <div className="auth-perk">✦ Early access to new collections</div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="auth-panel auth-panel--right">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Create Account</h1>
            <p className="auth-form-sub">Join JewelRocX to begin your luxury journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Priya Sharma"
                autoComplete="name"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="auth-pass-wrap">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                />
                <button type="button" className="auth-pass-toggle" onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
              {form.password && (
                <div className="password-strength">
                  <div className="password-strength__bars">
                    {[1,2,3,4].map(s => (
                      <div
                        key={s}
                        className="password-strength__bar"
                        style={{ background: s <= strength.score ? strength.color : '#EBEBEB' }}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <span className="password-strength__label" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  )}
                </div>
              )}
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                className={`form-input ${errors.confirm ? 'error' : ''}`}
                placeholder="Repeat password"
                autoComplete="new-password"
              />
              {errors.confirm && <span className="form-error">{errors.confirm}</span>}
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-switch__link">Sign In</Link>
          </p>
          <p className="auth-back"><Link to="/">← Back to Home</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
