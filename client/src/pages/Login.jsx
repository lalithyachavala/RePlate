
import React, { useState } from "react";
import { api, setToken } from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e){
    e.preventDefault();
    setMsg("");
    try{
      const data = await api("/auth/login", { method:"POST", body:{ email, password } });
      setToken(data.token);
      onLogin?.(data.user);
      window.location.href = "/";
    }catch(err){ setMsg(err.message); }
  }

  return (
    <div className="container">
      <div className="hero">
        <h1 className="hero-title">REPLATE</h1>
        <p className="hero-sub">Reducing food waste, one plate at a time.</p>
      </div>

      <div className="card" style={{maxWidth:520, margin:"0 auto"}}>
        <h2 className="card-title">Welcome back</h2>
        <form className="form" onSubmit={submit}>
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn btn-primary" type="submit">Sign in</button>
          {msg && <div className="alert alert-error">{msg}</div>}
        </form>
      </div>
    </div>
  );
}
