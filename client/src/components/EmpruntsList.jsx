import React, { useEffect, useState } from 'react';
import { formatDateFR } from '../utils/date';
import { useNavigate } from 'react-router-dom';
const base = import.meta.env.VITE_BASE_URL || '/';

const EmpruntsList = () => {
  const [emprunts, setEmprunts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(base + 'api/session', { credentials: 'include' }).then((res) => {
      if (res.status !== 200) {
        navigate('/login', { state: { flash: 'Veuillez vous connecter.' } });
      }
    });

    fetch(base + 'api/emprunts', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setEmprunts(data))
      .catch(() => setEmprunts([]));
  }, [navigate]);

  const handleRetour = (id_emprunt) => {
    fetch(base + 'api/emprunts/retour', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_emprunt }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        fetch(base + 'api/emprunts', { credentials: 'include' })
          .then((res) => res.json())
          .then((data) => setEmprunts(data));
      });
  };

  return (
    <div>
      <h2>Mes emprunts</h2>
      {emprunts.length === 0 ? (
        <p>Aucun emprunt en cours.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Livre</th>
              <th>Date d'emprunt</th>
              <th>Date retour prévue</th>
              <th>Date retour effective</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {emprunts.map((e) => (
              <tr key={e.id_emprunt}>
                <td>{e.titre}</td>
                <td>{formatDateFR(e.date_emprunt)}</td>
                <td>{formatDateFR(e.date_retour_prevue)}</td>
                <td>{formatDateFR(e.date_retour_effective)}</td>
                <td>{e.message || ''}</td>
                <td>
                  {!e.date_retour_effective && (
                    <button onClick={() => handleRetour(e.id_emprunt)}>
                      Retourner
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmpruntsList;
