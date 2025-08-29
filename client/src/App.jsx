import React, { useEffect, useState } from 'react';
import { getToken, api } from './api';
import './styles.css';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateListing from './pages/CreateListing';
import Mine from './pages/Mine';


function Router({ route, user, setUser }){
if(route === '/login') return <Login onLogin={setUser} />;
if(route === '/register') return <Register/>;
if(route === '/create') return user ? <CreateListing/> : <Login onLogin={setUser}/>;
if(route === '/mine') return user ? <Mine/> : <Login onLogin={setUser}/>;
return <Dashboard authed={!!user}/>;
}


export default function App(){
const [route, setRoute] = useState(window.location.pathname);
const [user, setUser] = useState(null);


useEffect(()=>{
const pop = () => setRoute(window.location.pathname);
window.addEventListener('popstate', pop);
return () => window.removeEventListener('popstate', pop);
},[]);


useEffect(()=>{
// Optional: ping a protected endpoint to fetch profile later
// For now, user stays in memory after login
},[]);


function navigate(to){
window.history.pushState({}, '', to);
setRoute(to);
}


function onLogout(){ localStorage.removeItem('token'); setUser(null); navigate('/'); }


// turn anchor clicks into SPA nav
useEffect(()=>{
const handler = (e)=>{
const a = e.target.closest('a[href^="/"]');
if(a){ e.preventDefault(); navigate(a.getAttribute('href')); }
};
document.addEventListener('click', handler);
return ()=>document.removeEventListener('click', handler);
},[]);


return (
<>
<NavBar user={user} onLogout={onLogout} />
<Router route={route} user={user} setUser={setUser} />
</>
);
}