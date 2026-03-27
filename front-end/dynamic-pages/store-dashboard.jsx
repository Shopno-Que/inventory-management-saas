import React, { useState } from "react";
import ReactDOM from "react-dom/client";

function StoreDashboard() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>Store Dashboard</h1>

      <button onClick={increment}>
        Click Me
      </button>

      <p>Count: {count}</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<StoreDashboard />);