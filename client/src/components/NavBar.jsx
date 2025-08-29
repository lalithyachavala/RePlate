import React from 'react';
export default function NavBar({ user, onLogout }) {
  return (
    <div className="navbar">
      <div className="navbar-inner">
        <a className="brand" href="/">RePlate</a>

        <div className="nav-links">
          <a href="/">Browse</a>
          {user && (
            <>
              <a href="/create">Create Listing</a>
              <a href="/mine">My Listings</a>
            </>
          )}
        </div>

        <div className="nav-right right">
          {!user ? (
            <>
              <a className="btn btn-outline" href="/login">Login</a>
              <a className="btn btn-primary" href="/register">Register</a>
            </>
          ) : (
            <button className="btn btn-outline" onClick={onLogout}>Logout</button>
          )}
        </div>
      </div>
    </div>
  );
}
