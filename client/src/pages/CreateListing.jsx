import React, { useState } from "react";
import { api } from "../api";

export default function CreateListing(){
  const [form, setForm] = useState({ title:"", description:"", quantity:"", pickup_location:"", expires_at:"" });
  const [msg, setMsg] = useState("");

  async function submit(e){
    e.preventDefault(); setMsg("");
    try{
      await api("/listings", { method:"POST", auth:true, body:form });
      setMsg("Listing created");
      setForm({ title:"", description:"", quantity:"", pickup_location:"", expires_at:"" });
    }catch(e){ setMsg(e.message); }
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:720, margin:"0 auto"}}>
        <h2 className="card-title">Create Listing</h2>
        <form className="form" onSubmit={submit}>
          <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
          <textarea className="textarea" rows="4" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
          <input className="input" placeholder="Quantity (e.g. 12 meals)" value={form.quantity} onChange={e=>setForm({...form, quantity:e.target.value})} />
          <input className="input" placeholder="Pickup Location" value={form.pickup_location} onChange={e=>setForm({...form, pickup_location:e.target.value})} />
          <label className="label">Expires At (optional)</label>
          <input className="input" type="datetime-local" value={form.expires_at} onChange={e=>setForm({...form, expires_at:e.target.value})} />
          <button className="btn btn-primary" type="submit">Post</button>
          {msg && <div className="alert">{msg}</div>}
        </form>
      </div>
    </div>
  );
}
