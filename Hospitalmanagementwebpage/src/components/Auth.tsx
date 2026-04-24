import { useState } from 'react'
import { supabase } from '../supabaseClient'

export function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleAuth = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      })
      if (error) setError(error.message)
      else setMessage('Check your email for confirmation!')
    }

    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAuth()
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen flex">

      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.4); opacity: 0.6; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .fade-up        { animation: fadeUp 0.6s ease forwards; }
        .fade-up-d1     { animation: fadeUp 0.6s 0.1s ease both; }
        .fade-up-d2     { animation: fadeUp 0.6s 0.2s ease both; }
        .fade-up-d3     { animation: fadeUp 0.6s 0.3s ease both; }
        .fade-up-d4     { animation: fadeUp 0.6s 0.4s ease both; }
        .fade-up-d5     { animation: fadeUp 0.6s 0.5s ease both; }

        .float-card     { animation: float 6s ease-in-out infinite; }
        .float-card-2   { animation: float 8s ease-in-out infinite reverse; }

        .input-field {
          width: 100%;
          background: #f8fffe;
          border: 1.5px solid #d1fae5;
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #1a2e1a;
          outline: none;
          transition: all 0.2s ease;
        }
        .input-field:focus {
          border-color: #10b981;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(16,185,129,0.1);
        }
        .input-field::placeholder { color: #a7c4b5; }

        .btn-primary {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #059669, #10b981, #34d399);
          background-size: 200% auto;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.3px;
        }
        .btn-primary:hover:not(:disabled) {
          background-position: right center;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(16,185,129,0.35);
        }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .tab-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .tab-active {
          background: white;
          color: #059669;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        .tab-inactive {
          background: transparent;
          color: #6b9e8a;
        }
        .tab-inactive:hover { color: #059669; }

        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #6b9e8a;
          font-size: 18px;
          padding: 2px;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: #059669; }

        .stat-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 16px 20px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          border: 1px solid rgba(255,255,255,0.8);
        }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex flex-col justify-between"
        style={{
          width: '48%',
          background: 'linear-gradient(145deg, #064e3b 0%, #065f46 40%, #047857 100%)',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background circles */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '320px', height: '320px',
          background: 'rgba(255,255,255,0.04)', borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '240px', height: '240px',
          background: 'rgba(255,255,255,0.04)', borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '60%',
          width: '160px', height: '160px',
          background: 'rgba(52,211,153,0.08)', borderRadius: '50%'
        }} />

        {/* Logo */}
        <div className="fade-up" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '16px', letterSpacing: '-0.3px' }}>KIIMS Hospital</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Patient Portal</div>
            </div>
          </div>
        </div>

        {/* Main text */}
        <div className="fade-up-d1" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '42px',
            lineHeight: 1.15,
            color: 'white',
            marginBottom: '20px',
            fontStyle: 'italic'
          }}>
            Your health,<br />
            <span style={{ color: '#6ee7b7' }}>our priority.</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.7, maxWidth: '320px' }}>
            Access your medical records, book appointments, and connect with our doctors — all in one place.
          </p>
        </div>

        {/* Stat cards */}
        <div className="fade-up-d2" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
            {[
              { num: '50+', label: 'Specialist Doctors' },
              { num: '24/7', label: 'Emergency Care' },
              { num: '98%', label: 'Patient Satisfaction' },
              { num: '15+', label: 'Departments' },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#059669', fontFamily: "'DM Serif Display', serif" }}>{s.num}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#34d399', display: 'inline-block',
              animation: 'pulse-dot 1.5s ease-in-out infinite'
            }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
              Emergency services active · Beds available: 12/40
            </span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="flex-1 flex items-center justify-center"
        style={{ background: '#f0fdf8', padding: '32px 24px' }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Mobile logo */}
          <div className="lg:hidden fade-up" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '52px', height: '52px',
              background: 'linear-gradient(135deg, #059669, #34d399)',
              borderRadius: '16px', marginBottom: '12px',
              boxShadow: '0 8px 24px rgba(16,185,129,0.3)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div style={{ fontWeight: 700, fontSize: '20px', color: '#064e3b' }}>KIIMS Hospital</div>
          </div>

          {/* Heading */}
          <div className="fade-up-d1" style={{ marginBottom: '28px' }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '30px', color: '#064e3b',
              marginBottom: '6px', fontStyle: 'italic'
            }}>
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p style={{ color: '#6b9e8a', fontSize: '14px' }}>
              {isLogin
                ? 'Sign in to access your patient dashboard'
                : 'Join thousands of patients managing their health'}
            </p>
          </div>

          {/* Card */}
          <div className="fade-up-d2" style={{
            background: 'white',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 4px 40px rgba(0,0,0,0.07)',
            border: '1px solid #d1fae5'
          }}>

            {/* Tab toggle */}
            <div style={{
              display: 'flex', gap: '4px',
              background: '#f0fdf4',
              borderRadius: '12px', padding: '4px',
              marginBottom: '24px',
              border: '1.5px solid #d1fae5'
            }}>
              <button className={`tab-btn ${isLogin ? 'tab-active' : 'tab-inactive'}`} onClick={() => setIsLogin(true)}>
                Sign In
              </button>
              <button className={`tab-btn ${!isLogin ? 'tab-active' : 'tab-inactive'}`} onClick={() => setIsLogin(false)}>
                Sign Up
              </button>
            </div>

            {/* Form fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {!isLogin && (
                <div className="fade-up">
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <input
                    className="input-field"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  className="input-field"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>Password</label>
                  {isLogin && (
                    <button style={{
                      background: 'none', border: 'none', fontSize: '12px',
                      color: '#059669', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
                    }}>
                      Forgot password?
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input-field"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="••••••••"
                    style={{ paddingRight: '44px' }}
                  />
                  <button className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding: '12px 14px',
                  background: '#fef2f2',
                  border: '1.5px solid #fecaca',
                  borderRadius: '10px',
                  color: '#dc2626',
                  fontSize: '13px',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Success */}
              {message && (
                <div style={{
                  padding: '12px 14px',
                  background: '#f0fdf4',
                  border: '1.5px solid #bbf7d0',
                  borderRadius: '10px',
                  color: '#16a34a',
                  fontSize: '13px',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  <span>✅</span> {message}
                </div>
              )}

              {/* Submit */}
              <button className="btn-primary" onClick={handleAuth} disabled={loading}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{
                      width: '16px', height: '16px',
                      border: '2px solid rgba(255,255,255,0.4)',
                      borderTopColor: 'white', borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.7s linear infinite'
                    }} />
                    Please wait...
                  </span>
                ) : isLogin ? 'Sign In →' : 'Create Account →'}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>or continue with</span>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
              </div>

              {/* Google OAuth placeholder */}
              <button
                onClick={async () => {
                  await supabase.auth.signInWithOAuth({ provider: 'google' })
                }}
                style={{
                  width: '100%', padding: '13px',
                  background: 'white',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px', fontWeight: 500,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  transition: 'all 0.2s ease',
                  color: '#374151'
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1C9.5 35.7 16.2 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C37 39 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </div>

          {/* Footer note */}
          <p className="fade-up-d4" style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '20px' }}>
            By continuing, you agree to our{' '}
            <span style={{ color: '#059669', cursor: 'pointer' }}>Terms of Service</span>
            {' '}and{' '}
            <span style={{ color: '#059669', cursor: 'pointer' }}>Privacy Policy</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}