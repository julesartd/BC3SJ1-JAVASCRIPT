import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/booklist.css';

const ROLES = ['utilisateur', 'admin'];

const BookList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [dateRetourPrevue, setDateRetourPrevue] = useState('');
  const base = import.meta.env.VITE_BASE_URL || '/';

  useEffect(() => {
    fetch(base + 'api/books', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error('Erreur:', error));
    fetch(base + 'api/session', { credentials: 'include' })
      .then((response) => {
        if (response.status === 200) return response.json();
        else throw new Error('Account not found');
      })
      .then((data) => setUserRole(data.user.role || ROLES[0]))
      .catch((error) => setUserRole(null));
  });

  const handleAddBook = () => {
    navigate('/add_book');
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleEmprunt = (bookId) => {
    setSelectedBookId(bookId);
    setShowDatePicker(true);
    setDateRetourPrevue('');
  };

  const submitEmprunt = () => {
    if (!dateRetourPrevue)
      return alert('Veuillez choisir une date de retour prévue.');
    fetch(base + 'api/emprunts', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_livre: selectedBookId,
        date_retour_prevue: dateRetourPrevue,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message || 'Emprunt effectué !');
        setShowDatePicker(false);
        setSelectedBookId(null);
        setDateRetourPrevue('');
        fetch(base + 'api/books', { credentials: 'include' })
          .then((response) => response.json())
          .then((data) => setBooks(data));
      })
      .catch((error) => alert("Erreur lors de l'emprunt"));
  };

  return (
    <div className="container">
      <h2>Liste des Livres - Librairie XYZ</h2>
      {books.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Titre</th>
              <th>Auteur</th>
              <th>Date de publication</th>
              <th>Statut</th>
              <th>Détails</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>
                  <img
                    className="book-image"
                    src={book.photo_url}
                    alt={book.titre}
                  />
                </td>
                <td>{book.titre}</td>
                <td>{book.auteur}</td>
                <td>{book.date_publication}</td>
                <td>{book.statut}</td>
                <td>
                  <a href={`${base}book/${book.id}`}>Voir les détails</a>
                </td>
                <td>
                  {book.statut === 'disponible' && ROLES.includes(userRole) ? (
                    <button onClick={() => handleEmprunt(book.id)}>
                      Emprunter
                    </button>
                  ) : (
                    <span>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Erreur lors de la récupération des livres.</p>
      )}
      {userRole === 'admin' && (
        <button onClick={handleAddBook}>Ajouter un livre</button>
      )}
      <button onClick={handleHome}>Retour à l'accueil</button>

      {showDatePicker && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowDatePicker(false)}
        >
          <div
            style={{
              background: '#fff',
              padding: '2rem',
              borderRadius: '8px',
              minWidth: '300px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Choisissez la date de retour prévue (max 30 jours)</h3>
            <input
              type="date"
              value={dateRetourPrevue}
              onChange={(e) => setDateRetourPrevue(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .slice(0, 10)}
              style={{ marginBottom: '1rem' }}
            />
            <br />
            <button onClick={submitEmprunt} style={{ marginRight: '1rem' }}>
              Valider
            </button>
            <button onClick={() => setShowDatePicker(false)}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;
