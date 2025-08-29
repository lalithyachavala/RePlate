import React, { useEffect, useState } from "react";
import { api } from "../api";
import ListingCard from "../components/ListingCard";

export default function Dashboard(){
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");

  async function load(){
    try{
      const data = await api(`/listings${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      setItems(data);
    }catch(e){ setMsg(e.message); }
  }
  useEffect(()=>{ load(); }, []);

  async function claim(id){
    try{ await api(`/listings/${id}/claim`, { method:"POST", auth:true, body:{} }); load(); }
    catch(e){ setMsg(e.message); }
  }

  return (
    <div className="container">
      <div className="row">
        <h2 className="card-title">Available Listings</h2>
        <div className="right row">
          <input className="input" placeholder="Search by title or pickup" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn btn-primary" onClick={load}>Search</button>
        </div>
      </div>

      {msg && <div className="alert space-top">{msg}</div>}

      <div className="grid space-top">
        {items.map(x => <ListingCard key={x.id} item={x} onClaim={claim} />)}
        {items.length===0 && <div className="card center">No listings yet.</div>}
      </div>
    </div>
  );
}
