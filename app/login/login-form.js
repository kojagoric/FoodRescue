 "use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [busy,setBusy] = useState(false);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError("");
    const response = await fetch("/api/auth/login", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({email,password})
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) { setError(data.error || "Login failed"); return; }
    router.push("/"); router.refresh();
  }

  return <form onSubmit={submit}>
    <label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
    <label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
    {error && <p className="error">{error}</p>}
    <button disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
  </form>;
}
