import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
const base = import.meta.env.VITE_BASE_URL || '/';

const Login = ({ setUserT }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const flash = location.state?.flash;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(base + 'api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setUserT(data);
        navigate('/dashboard');
      } else {
        setError(
          data.message || 'Une erreur est survenue. Veuillez réessayer.'
        );
      }
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <div>
      {flash && <p style={{ color: 'red' }}>{flash}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
      {error && <p>{error}</p>}
      <p>
        Vous n'avez pas de compte ? <a href={`${base}/register`}>S'inscrire</a>
      </p>
    </div>
  );
};

export default Login;
