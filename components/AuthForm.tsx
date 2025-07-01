import { useState, useEffect } from 'react';
import { account } from '../lib/appwrite';

export default function AuthForm({ onAuth }: { onAuth?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    account.get().then(setUser).catch(() => setUser(null));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await account.createEmailSession(email, password);
      const user = await account.get();
      setUser(user);
      if (onAuth) onAuth();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await account.create('unique()', email, password);
      await account.createEmailSession(email, password);
      const user = await account.get();
      setUser(user);
      if (onAuth) onAuth();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    await account.deleteSession('current');
    setUser(null);
    setLoading(false);
  };

  if (user) {
    return (
      <div>
        <p>Logged in as: {user.email}</p>
        <button onClick={handleLogout} disabled={loading}>Logout</button>
      </div>
    );
  }

  return (
    <form>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button onClick={handleLogin} disabled={loading}>Login</button>
      <button onClick={handleSignup} disabled={loading}>Sign Up</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
} 