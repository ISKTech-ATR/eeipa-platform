import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import BrandLogo from '../components/BrandLogo.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@aixplod.com')
  const [pw, setPw] = useState('')
  const [building, setBuilding] = useState('Gateway Kiaramas')
  const [err, setErr] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!email.trim() || !pw.trim()) {
      setErr('Please enter your email and password.')
      return
    }
    login({ name: 'AIX Admin', building, email: email.trim(), role: 'Administrator' })
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="login-screen">
      <div className="login-bg" aria-hidden />
      <form className="login-card" onSubmit={submit}>
        <div className="login-logo-plate dark">
          <BrandLogo variant="full" className="login-logo" />
        </div>
        <div className="login-brand-line">
          <div className="login-title">Enterprise Energy Intelligence</div>
          <div className="login-sub">&amp; Performance Assurance Platform</div>
        </div>

        <h2>Sign in to your console</h2>
        <p className="login-hint">Energy intelligence, verified savings &amp; ESG governance.</p>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@aixplod.com"
            autoComplete="username"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>

        <label>
          Building
          <select value={building} onChange={(e) => setBuilding(e.target.value)}>
            <option>Building 01</option>
            <option>Building 02</option>
            <option>Gateway Kiaramas</option>
            <option>All Buildings</option>
          </select>
        </label>

        {err && <div className="login-err">{err}</div>}

        <button type="submit" className="login-btn">
          Sign In
        </button>

        <div className="login-foot">
          <span>Forgot password?</span>
          <span>AIX · Powered by IS IKHLAS SUCI</span>
        </div>
      </form>
    </div>
  )
}
