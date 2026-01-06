import { useState, useEffect, useCallback } from "react";

function AdvancedCounter() {
  // Initialize count from localStorage if present
  const [count, setCount] = useState(() => {
    const stored = window.localStorage.getItem("count");
    return stored !== null ? JSON.parse(stored) : 0;
  });

  const [history, setHistory] = useState([0]);
  const [step, setStep] = useState(1);

  // Increment / Decrement / Reset handlers
  function handleIncrement() {
    setCount(prev => {
      const next = prev + step;
      setHistory(history => [...history, next]);
      return next;
    });
  }

  function handleDecrement() {
    setCount(prev => {
      const next = prev - step;
      setHistory(history => [...history, next]);
      return next;
    });
  }

  function handleReset() {
    setCount(0);
    setHistory([0]);
  }

  // Step input handler
  function handleStepChange(e) {
    const value = Number(e.target.value);
    if (Number.isNaN(value)) {
      return;
    }
    setStep(value);
  }

  // Auto-save count to localStorage whenever it changes
  useEffect(() => {
    window.localStorage.setItem("count", JSON.stringify(count));
  }, [count]);

  // Keyboard handler with useCallback
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setCount(prev => {
          const next = prev + step;
          setHistory(history => [...history, next]);
          return next;
        });
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setCount(prev => {
          const next = prev - step;
          setHistory(history => [...history, next]);
          return next;
        });
      }
    },
    [step]
  );

  // Add / remove keyboard event listeners
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Counter</h1>

      <p>Current Count: {count}</p>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button onClick={handleDecrement}>Decrement</button>
        <button onClick={handleIncrement}>Increment</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Step Value:{" "}
          <input
            type="number"
            value={step}
            onChange={handleStepChange}
          />
        </label>
      </div>

      <p>Changes saved.</p>

      <h2>Count History:</h2>
      <ul>
        {history.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>

      <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        Use ArrowUp to increment and ArrowDown to decrement.
      </p>
    </div>
  );
}

export default AdvancedCounter;