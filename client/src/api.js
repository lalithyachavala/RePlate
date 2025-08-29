const API = '/api';


export function setToken(t){ localStorage.setItem('token', t); }
export function getToken(){ return localStorage.getItem('token'); }


export async function api(path, { method='GET', body, auth=false }={}){
const headers = { 'Content-Type': 'application/json' };
if(auth){ headers['Authorization'] = `Bearer ${getToken()}`; }
const res = await fetch(`${API}${path}`, { method, headers, body: body?JSON.stringify(body):undefined });
if(!res.ok){ throw new Error((await res.json()).error || 'Request failed'); }
return res.json();
}