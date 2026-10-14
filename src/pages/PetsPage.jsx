import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fallbackPets } from '../data/pets';

function PetsPage() {
  const [allPets, setAllPets] = useState(fallbackPets);
  const [usingSamplePets, setUsingSamplePets] = useState(false);
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const visiblePets = selectedCategory
    ? allPets.filter((pet) => pet.category === selectedCategory)
    : allPets;

  useEffect(() => {
    fetch('/api/pets')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Pet API request failed');
        }
        return response.json();
      })
      .then((data) => {
        const hasPets = Array.isArray(data) && data.length > 0;
        setAllPets(hasPets ? data : fallbackPets);
        setUsingSamplePets(!hasPets);
      })
      .catch(() => setUsingSamplePets(true));
  }, []);

  return (
    <section className="page-section">
      <div className="container">
        <div className="section-heading centered wide-heading">
          <span className="eyebrow">{selectedCategory ? `Meet our ${selectedCategory.toLowerCase()} pets` : 'Meet our pets'}</span>
          <h2>{selectedCategory ? `Find your new ${selectedCategory.toLowerCase()} companion` : 'Find the companion who fits your life'}</h2>
          {usingSamplePets && <p className="data-notice">Showing sample listings while the pet service is unavailable.</p>}
        </div>

        <div className="pet-grid full-grid">
          {visiblePets.map((pet) => (
            <article key={pet.name} className="pet-item pet-page-item">
              <div className="pet-image-wrap">
                <img src={pet.image} alt={pet.name} />
                <span className="pet-badge">{pet.category}</span>
              </div>
              <div className="pet-info">
                <div className="pet-name-row">
                  <h3>{pet.name}</h3>
                  <span>{pet.age}</span>
                </div>
                <p>{pet.kind}</p>
                <small>{pet.location}</small>
              </div>
            </article>
          ))}
        </div>
        {visiblePets.length === 0 && (
          <p className="empty-state">No pets found in this category yet.</p>
        )}
      </div>
    </section>
  );
}

export default PetsPage;
