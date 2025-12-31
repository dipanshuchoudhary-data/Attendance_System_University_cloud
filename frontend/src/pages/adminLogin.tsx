import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const token = await userCred.user.getIdToken();
      localStorage.setItem("firebase_token", token);

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "100px auto" }}>
      <h2>Admin Login</h2>

      {/* 🔔 DEMO NOTICE */}
      <div style={{ background: "#eef", padding: 10, marginBottom: 10 }}>
        <strong>Demo Admin (MVP)</strong><br />
        Email: <code>admin@university.com</code><br />
        Password: <code>admin123</code>
      </div>

      <input
        placeholder="Admin Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Admin Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
    </div>
  );
}
