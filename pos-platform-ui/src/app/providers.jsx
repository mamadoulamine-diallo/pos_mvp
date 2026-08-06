import AuthProvider from "../features/auth/context/AuthProvider";
import { CalculatorProvider } from "../shared/calculator";

function Providers({ children }) {
  return (
    <AuthProvider>
      <CalculatorProvider>
        {children}
      </CalculatorProvider>
    </AuthProvider>
  );
}

export default Providers;