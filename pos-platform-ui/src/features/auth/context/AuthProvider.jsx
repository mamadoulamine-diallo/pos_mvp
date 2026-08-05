import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { loadCurrentUser } from "../services/authService";
import AuthContext from "./AuthContext";

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function initializeAuth() {
      try {
        const user = await loadCurrentUser();

        if (!cancelled) {
          setCurrentUser(user);
          setError(null);
        }
      } catch (requestError) {
        if (!cancelled) {
          console.error(
            "Impossible de charger l'utilisateur connecté.",
            requestError,
          );

          setCurrentUser(null);
          setError(requestError);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initializeAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await loadCurrentUser();

      setCurrentUser(user);

      return user;
    } catch (requestError) {
      console.error(
        "Impossible de rafraîchir l'utilisateur connecté.",
        requestError,
      );

      setCurrentUser(null);
      setError(requestError);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      error,
      authenticated: Boolean(currentUser),
      refreshCurrentUser,
    }),
    [
      currentUser,
      loading,
      error,
      refreshCurrentUser,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;