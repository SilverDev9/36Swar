import { useState } from "react";
import { Disc3, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      if (mode === "login") await login({ email, password });
      else await register({ name, email, password });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Check your connection.");
    } finally { setBusy(false); }
  }

  return <main className="auth-screen">
    <div className="auth-brand"><Disc3 size={30}/>soundwave</div>
    <form className="auth-card" onSubmit={submit}>
      <p className="eyebrow">YOUR MUSIC. YOUR MOMENT.</p>
      <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <p className="auth-subtitle">A little more of what moves you.</p>
      {mode === "register" && <label>Your name<input value={name} onChange={e => setName(e.target.value)} required maxLength="60" placeholder="Alex Morgan"/></label>}
      <label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"/></label>
      <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength="8" placeholder="At least 8 characters"/></label>
      {error && <div className="error-message">{error}</div>}
      <button className="primary-button auth-submit" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"} <ArrowRight size={17}/></button>
      <p className="switch-auth">{mode === "login" ? "New to SoundWave?" : "Already have an account?"}
        <button type="button" onClick={() => {setMode(mode === "login" ? "register" : "login"); setError("");}}>
          {mode === "login" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </form>
    <p className="auth-foot">Stream the soundtrack to your life.</p>
  </main>;
}
