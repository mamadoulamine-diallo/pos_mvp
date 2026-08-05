import AuthProvider from "../features/auth/context/AuthProvider";

function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

export default Providers;