import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  createUser as createUserService,
  loadUserRoles,
  loadUsers,
  updateUser as updateUserService,
} from "../services/userService";

function useUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const refreshUsers = useCallback(async () => {
    try {
      const data = await loadUsers();

      setUsers(data);
      setError(null);

      return data;
    } catch (requestError) {
      console.error(
        "Impossible de charger les utilisateurs.",
        requestError,
      );

      setError(
        "Impossible de charger les utilisateurs.",
      );

      return [];
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initializeUsers() {
      try {
        const [
          usersData,
          rolesData,
        ] = await Promise.all([
          loadUsers(),
          loadUserRoles(),
        ]);

        if (!cancelled) {
          setUsers(usersData);
          setRoles(rolesData);
          setError(null);
        }
      } catch (requestError) {
        console.error(
          "Impossible de charger les utilisateurs.",
          requestError,
        );

        if (!cancelled) {
          setError(
            "Impossible de charger les utilisateurs.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initializeUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  const createUser = useCallback(
    async (data) => {
      const createdUser =
        await createUserService(data);

      await refreshUsers();

      return createdUser;
    },
    [refreshUsers],
  );

  const updateUser = useCallback(
    async (id, data) => {
      const updatedUser =
        await updateUserService(
          id,
          data,
        );

      await refreshUsers();

      return updatedUser;
    },
    [refreshUsers],
  );

  return {
    users,
    roles,

    loading,
    error,

    refreshUsers,
    createUser,
    updateUser,
  };
}

export default useUsers;