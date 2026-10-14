function ContactPage() {
  return (
    <section className="page-section">
      <div className="container contact-layout">
        <div className="contact-copy">
          <span className="eyebrow">Get in touch</span>
          <h2>We’d love to help you find your new best friend.</h2>
          <p>
            Whether you are looking to adopt, foster, or volunteer, our team is ready to guide you through the next step.
          </p>

          <div className="contact-list">
            <div>
              <strong>Email</strong>
              <span>hello@pawfectmatch.in</span>
            </div>
            <div>
              <strong>Phone</strong>
              <span>+91 98765 43210</span>
            </div>
            <div>
              <strong>Location</strong>
              <span>45 MG Road, Bengaluru, India</span>
            </div>
          </div>
        </div>

        <form className="contact-card">
          <div className="field-row">
            <label>
              Name
              <input type="text" placeholder="Your name" />
            </label>
          </div>

          <div className="field-row">
            <label>
              Email
              <input type="email" placeholder="you@example.com" />
            </label>
          </div>

          <div className="field-row">
            <label>
              Message
              <textarea rows="5" placeholder="Tell us what kind of pet you are looking for" />
            </label>
          </div>

          <button type="submit" className="primary-btn full-width">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

export default ContactPage;
