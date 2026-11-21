import { useState } from "react";

function CategoryForm({
  category = null,
  onSubmit,
  onCancel,
}) {
  const isEditing = Boolean(category);

  const [name, setName] = useState(
    category?.name ?? "",
  );

  const [active, setActive] = useState(
    category?.active ?? true,
  );

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedName = name.trim();

    if (!normalizedName) {
      setError(
        "Le nom de la catégorie est obligatoire.",
      );
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const request = isEditing
        ? {
            name: normalizedName,
            active,
          }
        : {
            name: normalizedName,
          };

      await onSubmit(request);
    } catch (requestError) {
      console.error(
        "Impossible d'enregistrer la catégorie.",
        requestError,
      );

      setError(
        "Impossible d'enregistrer la catégorie.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="CategoryForm"
      onSubmit={handleSubmit}
    >
      <label className="CategoryForm-field">
        <span>Nom *</span>

        <input
          type="text"
          value={name}
          required
          autoFocus
          onChange={(event) =>
            setName(event.target.value)
          }
        />
      </label>

      {isEditing && (
        <label className="CategoryForm-field">
          <span>Statut</span>

          <select
            value={String(active)}
            onChange={(event) =>
              setActive(
                event.target.value === "true",
              )
            }
          >
            <option value="true">
              Active
            </option>

            <option value="false">
              Inactive
            </option>
          </select>
        </label>
      )}

      {error && (
        <p className="CategoryForm-error">
          {error}
        </p>
      )}

      <div className="CategoryForm-actions">
        <button
          type="button"
          className="CategoryForm-cancel"
          disabled={submitting}
          onClick={onCancel}
        >
          Annuler
        </button>

        <button
          type="submit"
          className="CategoryForm-submit"
          disabled={submitting}
        >
          {submitting
            ? "Enregistrement..."
            : isEditing
              ? "Enregistrer"
              : "Créer"}
        </button>
      </div>
    </form>
  );
}

export default CategoryForm;