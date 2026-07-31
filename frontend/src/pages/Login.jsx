import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import {
  LogIn,
  Lock,
  Mail,
  Loader2,
  Eye,
  EyeOff,
  Globe,
  GitBranch,
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) errors.email = 'Email is required';
    else if (!emailRegex.test(email)) errors.email = 'Please enter a valid email';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (rememberMe) {
        // Optionally store email or token with longer expiry
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Optional: load remembered email on mount
  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberedEmail');
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen grid place-items-center bg-[#050816] px-4 py-8 relative overflow-hidden text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.35),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(192,132,252,0.28),_transparent_20%)] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/90 to-transparent blur-2xl" />

      <div className="relative w-full max-w-5xl grid gap-6 lg:grid-cols-[1.1fr_1fr] items-center overflow-hidden rounded-[40px] border border-slate-700/60 bg-slate-950/90 shadow-[0_40px_120px_-50px_rgba(15,23,42,0.85)] backdrop-blur-xl">
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-indigo-600 via-violet-700 to-slate-950 p-10 sm:p-12 lg:p-14">
          <div className="absolute inset-0 opacity-30 mix-blend-screen bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.25),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(67,56,202,0.35),_transparent_25%)]" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/15 ring-1 ring-white/20 text-white shadow-[0_24px_80px_-40px_rgba(224,231,255,0.8)] mb-6">
                <LogIn size={28} strokeWidth={1.75} />
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Better task focus
              </h1>
              <p className="mt-4 max-w-md text-slate-200/90 text-sm sm:text-base leading-7">
                Log in and manage everything from one smart dashboard. Clean visuals, instant filtering, and elevated task productivity.
              </p>
            </div>

            <div className="mt-10 grid gap-4 text-sm text-slate-200/90">
              <div className="rounded-3xl bg-white/10 border border-white/10 p-4">
                <p className="font-medium text-white">Fast Access</p>
                <p className="mt-1 text-slate-200/80">Sign in quickly and jump straight to your task board.</p>
              </div>
              <div className="rounded-3xl bg-white/10 border border-white/10 p-4">
                <p className="font-medium text-white">Secure Session</p>
                <p className="mt-1 text-slate-200/80">Your login details stay protected with strong validation and safe storage.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <div className="absolute inset-x-6 top-0 h-24 rounded-b-[2rem] bg-slate-900/75 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-400">Task Manager</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Sign in to your account</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-3xl border border-slate-700/70 bg-slate-900/80 px-4 py-2 text-xs text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
                Secure login
              </div>
            </div>

            {error && (
              <div className="mb-6 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200 shadow-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5" noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => validateForm()}
                    placeholder="you@example.com"
                    disabled={loading}
                    className={`w-full rounded-3xl border px-4 py-3 pl-12 text-slate-100 placeholder:text-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
                      validationErrors.email ? 'border-rose-500 text-rose-100' : 'border-slate-700 bg-slate-900/95'
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-2 text-sm text-rose-300">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => validateForm()}
                    placeholder="••••••••"
                    disabled={loading}
                    className={`w-full rounded-3xl border px-4 py-3 pl-12 pr-14 text-slate-100 placeholder:text-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
                      validationErrors.password ? 'border-rose-500 text-rose-100' : 'border-slate-700 bg-slate-900/95'
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-2 text-sm text-rose-300">{validationErrors.password}</p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 transition-all disabled:opacity-60"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Forgot password functionality coming soon.');
                  }}
                  className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-3xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition duration-200 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-x-0 top-1/2 h-px bg-slate-700/60" />
              <p className="relative mx-auto w-max bg-slate-950 px-4 text-xs uppercase tracking-[0.3em] text-slate-500">
                or continue with
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => alert('Google login coming soon.')}
                className="flex items-center justify-center gap-2 rounded-3xl border border-slate-700/70 bg-slate-900/95 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-indigo-500/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Globe size={18} className="text-cyan-300" />
                Google
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => alert('GitHub login coming soon.')}
                className="flex items-center justify-center gap-2 rounded-3xl border border-slate-700/70 bg-slate-900/95 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-violet-500/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <GitBranch size={18} className="text-slate-300" />
                GitHub
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-slate-400">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/signup');
                }}
                className="font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;