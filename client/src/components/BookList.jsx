import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/booklist.css';

const BookList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [userRole, setUserRole] = useState('');
  const base = import.meta.env.VITE_BASE_URL || '/';

  useEffect(() => {
    fetch(base + 'api/books', {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error('Erreur:', error));
    fetch(base + 'api/session', {
      credentials: 'include',
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else throw new Error('Account not found');
      })
      .then((data) => setUserRole(data.user.role || 'Guest'))
      .catch((error) => setUserRole('Guest'));
  }, []);

  const handleAddBook = () => {
    navigate('/add_book');
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleEmprunt = (bookId) => {
    const dateRetourPrevue = prompt(
      'Entrez la date de retour prévue (YYYY-MM-DD, max 30 jours) :'
    );
    if (!dateRetourPrevue) return;
    fetch(base + 'api/emprunts', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_livre: bookId,
        date_retour_prevue: dateRetourPrevue,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message || 'Emprunt effectué !');
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
              <th>Action</th> {/* Nouvelle colonne */}
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
                  {book.statut === 'disponible' && userRole !== 'Guest' ? (
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
    </div>
  );
};

export default BookList;
