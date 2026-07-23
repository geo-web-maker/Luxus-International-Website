import { useState } from "react";

// PLACEHOLDER AUTH — this is not real security. It exists only so the admin
// panel isn't wide open to anyone who finds /admin while there's no backend.
// Replace entirely once FastAPI auth (JWT) is live: this whole file should be
// swapped for a real login screen that calls POST /api/auth/login and stores
// a token, with route protection based on a verified session, not a client
// side password check that ships in the JS bundle.
const DEV_PASSWORD = "luxuz-admin";
const SESSION_KEY = "luxuz-admin-session";

export default function AdminGuard({ children }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) return children;

  const onSubmit = (e) => {
    e.preventDefault();
    if (input === DEV_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="admin-gate">
      <form className="admin-gate-card" onSubmit={onSubmit}>
        <span className="eyebrow mono">/admin</span>
        <h1>Luxuz Consult admin</h1>
        <p>Temporary access screen — replace with real auth before this ever goes to production.</p>
        <input
          type="password"
          autoFocus
          placeholder="Password"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(false);
          }}
        />
        {error && <div className="error">Incorrect password.</div>}
        <button type="submit" className="btn-primary">Enter</button>
      </form>
    </div>
  );
}
