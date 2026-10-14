import { useState } from 'react';

const sessionKey = 'pawfect-account-session';

function readSession() {
  try {
    const savedSession = JSON.parse(sessionStorage.getItem(sessionKey));
    if (savedSession?.expiresAt > Date.now()) {
      return savedSession;
    }
  } catch {
    sessionStorage.removeItem(sessionKey);
  }

  sessionStorage.removeItem(sessionKey);
  return null;
}

function AccountPage() {
  const [mode, setMode] = useState('login');
  const [session, setSession] = useState(readSession);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const isRegistering = mode === 'register';
      const response = await fetch(`/api/auth/${isRegistering ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isRegistering ? { name } : {}),
          email,
          password,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Unable to sign in. Please try again.');
        return;
      }

      const nextSession = {
        accessToken: result.access_token,
        user: result.user,
        expiresAt: Date.now() + result.expires_in * 1000,
      };
      sessionStorage.setItem(sessionKey, JSON.stringify(nextSession));
      setSession(nextSession);
      setPassword('');
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSignOut() {
    sessionStorage.removeItem(sessionKey);
    setSession(null);
  }

  return (
    <section className="page-section account-section">
      <div className="container account-layout">
        <div className="account-intro">
          <span className="eyebrow">Your Pawfect Match</span>
          <h1>{session ? `Welcome, ${session.user.name}` : 'A new friend starts here.'}</h1>
          <p>
            {session
              ? 'You are signed in and ready to continue your adoption journey.'
              : 'Create an account to keep your adoption journey close, or sign in to pick up where you left off.'}
          </p>
        </div>

        <div className="contact-card account-card">
          {session ? (
            <div className="account-signed-in">
              <span className="eyebrow">Signed in</span>
              <p>{session.user.email || session.user.name}</p>
              <button className="secondary-btn full-width" type="button" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <div className="account-tabs" role="tablist" aria-label="Account access">
                <button
                  className="account-tab"
                  type="button"
                  role="tab"
                  aria-selected={mode === 'login'}
                  onClick={() => { setMode('login'); setError(''); }}
                >
                  Sign In
                </button>
                <button
                  className="account-tab"
                  type="button"
                  role="tab"
                  aria-selected={mode === 'register'}
                  onClick={() => { setMode('register'); setError(''); }}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {mode === 'register' && (
                  <div className="field-row">
                    <label htmlFor="account-name">
                      Name
                      <input
                        id="account-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        minLength="2"
                        maxLength="80"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                      />
                    </label>
                  </div>
                )}

                <div className="field-row">
                  <label htmlFor="account-email">
                    Email
                    <input
                      id="account-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      maxLength="254"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </label>
                </div>

                <div className="field-row">
                  <label htmlFor="account-password">
                    Password
                    <input
                      id="account-password"
                      name="password"
                      type="password"
                      autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                      minLength="8"
                      maxLength="128"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </label>
                </div>

                {error && <p className="account-error" role="alert">{error}</p>}

                <button className="primary-btn full-width" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Please wait...' : mode === 'register' ? 'Create Account' : 'Sign In'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default AccountPage;