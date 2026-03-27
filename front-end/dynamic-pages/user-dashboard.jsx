import React from "react";
import ReactDOM from "react-dom/client";

function UserDashboard() {
  return (
    <div>
      <h1>User Dashboard</h1>
      <p>This is another React page</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<UserDashboard />);