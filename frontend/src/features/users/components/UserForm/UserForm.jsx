// UserForm.jsx
import { useState } from "react";

import "./UserForm.scss";

function UserForm({
  mode = "create",
  user = null,
  roles = [],
  onSubmit,
  onCancel,
}) {
  const [fullName, setFullName] = useState(
    user?.fullName ?? "",
  );

  const [email, setEmail] = useState(
    user?.email ?? "",
  );

  const [pinCode, setPinCode] =
    useState("");

  const [role, setRole] = useState(
    user?.role ??
      roles[0] ??
      "",
  );

  const [active, setActive] = useState(
    user?.active ?? true,
  );

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!fullName.trim()) {
      setError("Le nom est obligatoire.");
      return;
    }

    if (!pinCode.trim()) {
      setError(
        mode === "edit"
          ? "Saisissez le PIN à utiliser pour cet utilisateur."
          : "Le PIN est obligatoire.",
      );

      return;
    }

    if (!role) {
      setError("Le rôle est obligatoire.");
      return;
    }

    const request = {
      fullName: fullName.trim(),
      email: email.trim(),
      pinCode: pinCode.trim(),
      role,
    };

    if (mode === "edit") {
      request.active = active;
    }

    try {
      setSubmitting(true);
      setError(null);

      await onSubmit(request);
    } catch (requestError) {
      console.error(
        "Impossible d'enregistrer l'utilisateur.",
        requestError,
      );

      setError(
        requestError.message ||
          "Impossible d'enregistrer l'utilisateur.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="UserForm"
      onSubmit={handleSubmit}
    >
      <label className="UserForm-field">
        <span>Nom complet *</span>

        <input
          type="text"
          required
          value={fullName}
          onChange={(event) =>
            setFullName(event.target.value)
          }
        />
      </label>

      <label className="UserForm-field">
        <span>Email</span>

        <input
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
        />
      </label>

      <label className="UserForm-field">
        <span>
          {mode === "edit"
            ? "PIN à enregistrer *"
            : "PIN *"}
        </span>

        <input
          type="password"
          inputMode="numeric"
          autoComplete="new-password"
          required
          value={pinCode}
          onChange={(event) =>
            setPinCode(event.target.value)
          }
        />

        {mode === "edit" && (
          <small>
            Le PIN actuel n'est jamais affiché.
          </small>
        )}
      </label>

      <label className="UserForm-field">
        <span>Rôle *</span>

        <select
          required
          value={role}
          onChange={(event) =>
            setRole(event.target.value)
          }
        >
          {roles.map((userRole) => (
            <option
              key={userRole}
              value={userRole}
            >
              {userRole}
            </option>
          ))}
        </select>
      </label>

      {mode === "edit" && (
        <label className="UserForm-switch">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) =>
              setActive(event.target.checked)
            }
          />

          <span>Utilisateur actif</span>
        </label>
      )}

      {error && (
        <p className="UserForm-error">
          {error}
        </p>
      )}

      <footer className="UserForm-actions">
        <button
          type="button"
          className="UserForm-cancel"
          disabled={submitting}
          onClick={onCancel}
        >
          Annuler
        </button>

        <button
          type="submit"
          className="UserForm-submit"
          disabled={submitting}
        >
          {submitting
            ? "Enregistrement..."
            : mode === "edit"
              ? "Modifier"
              : "Créer"}
        </button>
      </footer>
    </form>
  );
}

export default UserForm;