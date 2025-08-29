import React from 'react';

export default function ListingCard({ item, onClaim }) {
  return (
    <div className="card">
      <div className="row">
        <h3 className="card-title">{item.title}</h3>
        <span className="right muted" style={{fontSize:12}}>by {item.owner_name}</span>
      </div>

      {item.description && <p className="muted" style={{marginTop:8}}>{item.description}</p>}

      <div className="grid grid-2" style={{marginTop:12}}>
        <div><b>Quantity:</b> {item.quantity || '—'}</div>
        <div><b>Pickup:</b> {item.pickup_location}</div>
        {item.expires_at && (
          <div className="muted"><b>Expires:</b> {new Date(item.expires_at).toLocaleString()}</div>
        )}
      </div>

      <div className="row right space-top">
        {item.status === 'open' ? (
          <button className="btn btn-primary" onClick={() => onClaim(item.id)}>Claim</button>
        ) : (
          <span className="badge">{item.status}</span>
        )}
      </div>
    </div>
  );
}
