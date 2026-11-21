import { Plus } from "lucide-react";
import { useState } from "react";

import UserForm from "../components/UserForm";
import UserList from "../components/UserList";
import UserModal from "../components/UserModal";

import useUsers from "../hooks/useUsers";

import "./UsersPage.scss";

function UsersPage() {
  const {
    users,
    roles,
    loading,
    error,
    createUser,
    updateUser,
  } = useUsers();

  const [createOpen, setCreateOpen] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState(null);

  async function handleCreateUser(request) {
    await createUser(request);

    setCreateOpen(false);
  }

  async function handleUpdateUser(request) {
    if (!editingUser) {
      return;
    }

    await updateUser(
      editingUser.id,
      request,
    );

    setEditingUser(null);
  }

  return (
    <main className="UsersPage">
      <header className="UsersPage-header">
        <div>
          <h1>Utilisateurs</h1>

          <p>
            {users.length}{" "}
            {users.length === 1
              ? "utilisateur"
              : "utilisateurs"}
          </p>
        </div>

        <button
          type="button"
          className="UsersPage-add CTA"
          onClick={() =>
            setCreateOpen(true)
          }
        >
          <Plus
            size={18}
            aria-hidden="true"
          />

          Ajouter un utilisateur
        </button>
      </header>

      {loading && (
        <p className="UsersPage-message">
          Chargement des utilisateurs...
        </p>
      )}

      {error && (
        <p className="UsersPage-message UsersPage-message--error">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        users.length === 0 && (
          <div className="UsersPage-empty">
            <h2>Aucun utilisateur</h2>

            <p>
              Ajoutez un utilisateur
              pour commencer.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        users.length > 0 && (
          <UserList
            users={users}
            onSelect={setEditingUser}
          />
        )}

      <UserModal
        open={createOpen}
        title="Nouvel utilisateur"
        onClose={() =>
          setCreateOpen(false)
        }
      >
        <UserForm
          key={
            createOpen
              ? "create-open"
              : "create-closed"
          }
          mode="create"
          roles={roles}
          onSubmit={handleCreateUser}
          onCancel={() =>
            setCreateOpen(false)
          }
        />
      </UserModal>

      <UserModal
        open={Boolean(editingUser)}
        title="Modifier l'utilisateur"
        onClose={() =>
          setEditingUser(null)
        }
      >
        {editingUser && (
          <UserForm
            key={editingUser.id}
            mode="edit"
            user={editingUser}
            roles={roles}
            onSubmit={handleUpdateUser}
            onCancel={() =>
              setEditingUser(null)
            }
          />
        )}
      </UserModal>
    </main>
  );
}

export default UsersPage;