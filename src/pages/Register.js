import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [qr, setQr] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState(1);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", {
        username,
        email,
        password,
      });
      setQr(res.data.qr);
      setStep(2); // move to QR step
    } catch (err) {
      alert("Registration failed");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/verify", { username, token });
      alert("✅ Registration complete! You can now log in.");
    } catch {
      alert("Invalid 2FA code");
    }
  };

  return (
    <div>
      {step === 1 && (
        <form onSubmit={handleRegister}>
          <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Register</button>
        </form>
      )}

      {step === 2 && (
        <div>
          <h3>Scan this QR with Google Authenticator</h3>
          <img src={qr} alt="QR code" />
          <form onSubmit={handleVerify}>
            <input placeholder="Enter 2FA code" value={token} onChange={(e) => setToken(e.target.value)} />
            <button type="submit">Verify</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Register;
