import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Mine(){
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");

  async function load(){ try{ setItems(await api("/listings/mine", { auth:true })); } catch(e){ setMsg(e.message); } }
  useEffect(()=>{ load(); }, []);

  async function complete(id){
    try{ await api(`/listings/${id}/complete`, { method:"POST", auth:true, body:{} }); setMsg("Marked completed"); load(); }
    catch(e){ setMsg(e.message); }
  }

  return (
    <div className="container">
      <h2 className="card-title">My Listings</h2>
      {msg && <div className="alert space-top">{msg}</div>}

      <div className="grid space-top">
        {items.map(x=>(
          <div key={x.id} className="card">
            <div className="row">
              <h3 className="card-title">{x.title}</h3>
              <span className="badge right">Status: {x.status}</span>
            </div>
            <button className="btn btn-primary space-top" onClick={()=>complete(x.id)}>Mark Completed</button>
          </div>
        ))}
        {items.length===0 && <div className="card center">No listings yet.</div>}
      </div>
    </div>
  );
}
