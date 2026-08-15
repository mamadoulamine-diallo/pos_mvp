import { Navigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

function ProtectedRoute({ children }) {
  const {
    authenticated,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="AuthLoading">
        Chargement...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;