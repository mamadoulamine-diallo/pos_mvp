import { LockKeyhole, Store } from "lucide-react";

import { useState } from "react";

import { Navigate, useNavigate } from "react-router-dom";

import PinPad from "../components/PinPad";
import useAuth from "../hooks/useAuth";

import "./LoginPage.scss";

function LoginPage() {
  const navigate = useNavigate();

  const { authenticated, loading, login } = useAuth();

  const [pinCode, setPinCode] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState(null);

  function handlePinChange(value) {
    setPinCode(value);
    setError(null);
  }

  async function handleLogin() {
    if (pinCode.length !== 4 || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await login(pinCode);

      navigate("/", {
        replace: true,
      });
    } catch (requestError) {
      console.error("Connexion impossible.", requestError);

      setPinCode("");

      setError(requestError.message || "Code PIN incorrect.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="LoginPage">
        <p className="LoginPage-loading">Vérification de la session...</p>
      </main>
    );
  }

  if (authenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="LoginPage">
      <section className="LoginCard">
        <header className="LoginCard-header">
          <div className="LoginCard-logo">
            <Store size={26} aria-hidden="true" />
          </div>

          <div>
            <span className="LoginCard-app">POS Platform</span>

            <h1>Connexion</h1>
          </div>
        </header>

        <div className="LoginCard-intro">
          <LockKeyhole size={20} aria-hidden="true" />

          <p>Entrez votre code PIN pour accéder à la caisse.</p>
        </div>

        {error && (
          <p className="LoginCard-error" role="alert">
            {error}
          </p>
        )}

        <PinPad
          value={pinCode}
          disabled={submitting}
          onChange={handlePinChange}
          onSubmit={handleLogin}
        />

        {submitting && <p className="LoginCard-status">Connexion...</p>}
      </section>
    </main>
  );
}

export default LoginPage;
