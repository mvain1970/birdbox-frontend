import React from "react";

function Dashboard() {
  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Birdbox Dashboard</h2>
      <p>Welcome! You are logged in successfully.</p>
      <p>Here we will later show:</p>
      <ul>
        <li>🌡️ Temperature & Humidity</li>
        <li>⚖️ Weight from HX711</li>
        <li>📶 WiFi Signal</li>
        <li>💨 Fan Status</li>
      </ul>
    </div>
  );
}

export default Dashboard;
