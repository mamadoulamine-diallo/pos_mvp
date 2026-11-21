import {
  useCallback,
  useEffect,
  useState,
} from "react";

import AuthContext from "./AuthContext";

import {
  loadCurrentUser,
  login as loginService,
  logout as logoutService,
} from "../services/authService";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function initializeAuth() {
      try {
        const currentUser =
          await loadCurrentUser();

        if (!cancelled) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error(
          "Impossible de vérifier la session.",
          error,
        );

        if (!cancelled) {
          setUser(null);
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

  const login = useCallback(
    async (pinCode) => {
      const authenticatedUser =
        await loginService(pinCode);

      setUser(authenticatedUser);

      return authenticatedUser;
    },
    [],
  );

  const logout = useCallback(async () => {
    await logoutService();

    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    authenticated: Boolean(user),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;