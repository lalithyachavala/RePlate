
import React, { useState } from "react";
import { api } from "../api";

export default function Register(){
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"host" });
  const [msg, setMsg] = useState("");

  async function submit(e){
    e.preventDefault(); setMsg("");
    try{
      await api("/auth/register", { method:"POST", body:form });
      setMsg("Registered! You can log in now.");
      setForm({ ...form, password:"" });
    }catch(err){ setMsg(err.message); }
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:560, margin:"24px auto"}}>
        <h2 className="card-title">Create your account</h2>
        <form className="form" onSubmit={submit}>
          <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />

          <label className="label">Role</label>
          <select className="select" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
            <option value="host">Host (Restaurant/Home)</option>
            <option value="ngo">NGO</option>
            <option value="volunteer">Volunteer</option>
          </select>

          <button className="btn btn-primary" type="submit">Create account</button>
          {msg && <div className="alert">{msg}</div>}
        </form>
      </div>
    </div>
  );
}
