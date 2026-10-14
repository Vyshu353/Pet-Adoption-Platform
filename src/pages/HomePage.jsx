import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fallbackPets } from '../data/pets';

const categories = [
  { name: 'Dogs', category: 'Dog', count: '240 pets', icon: '🐶', accent: 'peach' },
  { name: 'Cats', category: 'Cat', count: '185 pets', icon: '🐱', accent: 'lavender' },
  { name: 'Birds', category: 'Bird', count: '64 pets', icon: '🐦', accent: 'mint' },
  { name: 'Small Pets', category: 'Small Pet', count: '93 pets', icon: '🐰', accent: 'sky' },
];

const reasons = [
  { icon: '🏠', title: 'Safe Homes', text: 'Every pet is carefully matched with a loving and responsible family.' },
  { icon: '🩺', title: 'Health Checked', text: 'Our pets receive medical exams, vaccinations, and behavioral screening.' },
  { icon: '💙', title: 'Expert Support', text: 'Our adoption specialists guide you through every step with care.' },
];

const steps = [
  'Browse available pets',
  'Schedule a meet-and-greet',
  'Complete the adoption form',
  'Bring your new friend home',
];

const reviews = [
  {
    name: 'Emma R.',
    quote: 'The process was effortless and the team genuinely cared about finding the right fit for our family.',
  },
  {
    name: 'Daniel M.',
    quote: 'We found our perfect pup in less than a week. The support and guidance were amazing.',
  },
];

function HomePage() {
  const [pets, setPets] = useState(fallbackPets.slice(0, 4));
  const [usingSamplePets, setUsingSamplePets] = useState(false);

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
        setPets(hasPets ? data.slice(0, 4) : fallbackPets.slice(0, 4));
        setUsingSamplePets(!hasPets);
      })
      .catch(() => setUsingSamplePets(true));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Find Your Best Friend</span>
            <h1>Give a pet a loving home and bring joy home with you.</h1>
            <p>
              Discover caring, healthy companions ready to become part of your family.
              From playful pups to gentle cats, we help you find the perfect match.
            </p>

            <div className="hero-actions">
              <a href="/pets" className="primary-btn">
                Meet Pets
              </a>
              <a href="/contact" className="secondary-btn">
                Volunteer
              </a>
            </div>

            <div className="stats">
              <div>
                <strong>1200+</strong>
                <span>Pets adopted</span>
              </div>
              <div>
                <strong>98%</strong>
                <span>Happy matches</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Support</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="pet-card large-card">
              <img
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=80"
                alt="Happy dog"
              />
              <div className="floating-badge">
                <span>✅</span>
                <div>
                  <strong>Ready for adoption</strong>
                  <small>5 new companions this week</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="categories section-spacing">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Browse by type</span>
            <h2>Find pets you’ll love</h2>
          </div>

          <div className="category-grid">
            {categories.map(({ name, category, count, icon, accent }) => (
              <Link key={name} to={`/pets?category=${encodeURIComponent(category)}`} className={`category-card ${accent}`}>
                <div className="category-icon">{icon}</div>
                <div>
                  <h3>{name}</h3>
                  <p>{count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="featured section-spacing">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow">Featured companions</span>
              <h2>Meet adorable pets waiting for a family</h2>
              {usingSamplePets && <p className="data-notice">Showing sample listings while the pet service is unavailable.</p>}
            </div>
            <a href="/pets" className="text-btn">
              View all pets
            </a>
          </div>

          <div className="pet-grid">
            {pets.map((pet) => (
              <article key={pet.name} className="pet-item">
                <div className="pet-image-wrap">
                  <img src={pet.image} alt={pet.name} />
                  <span className="pet-badge">{pet.badge}</span>
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
        </div>
      </section>

      <section className="why-us section-spacing">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">Why choose us</span>
            <h2>Compassionate care from the very first hello</h2>
          </div>

          <div className="reasons-grid">
            {reasons.map(({ icon, title, text }) => (
              <article key={title} className="reason-card">
                <div className="reason-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="process section-spacing">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">Simple process</span>
            <h2>How adoption works</h2>
          </div>

          <div className="process-grid">
            {steps.map((step, index) => (
              <div key={step} className="step-item">
                <span className="step-number">0{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reviews section-spacing">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">Success stories</span>
            <h2>Families and pets reunited</h2>
          </div>

          <div className="review-grid">
            {reviews.map(({ name, quote }) => (
              <article key={name} className="review-card">
                <div className="stars">★★★★★</div>
                <p>“{quote}”</p>
                <strong>{name}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
