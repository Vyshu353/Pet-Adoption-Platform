const values = [
  {
    title: 'Safe Matching',
    text: 'We take time to understand homes, routines, and personalities before matching a pet with a family.',
  },
  {
    title: 'Responsible Care',
    text: 'Every animal receives medical care, enrichment, and training support before adoption.',
  },
  {
    title: 'Long-Term Support',
    text: 'Our team stays connected to families after adoption to help pets thrive in their new homes.',
  },
];

function AboutPage() {
  return (
    <section className="page-section">
      <div className="container">
        <div className="section-heading centered wide-heading">
          <span className="eyebrow">Our story</span>
          <h2>We exist to make adoption joyful, safe, and lasting</h2>
        </div>

        <div className="story-grid">
          <div className="story-image-card">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80"
              alt="Happy pet rescue scene"
            />
          </div>

          <div className="story-copy">
            <p>
              Pawfect Match was created to connect shelter animals with families who are ready to give them safety,
              comfort, and love. We believe pets deserve thoughtful care and every adoption should be rooted in a real,
              long-term connection.
            </p>
            <p>
              Our team partners with local rescues, veterinarians, and foster families to ensure each companion is health
              checked, prepared for home life, and carefully matched to the right environment.
            </p>
          </div>
        </div>

        <div className="value-grid">
          {values.map(({ title, text }) => (
            <article key={title} className="value-card">
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutPage;
