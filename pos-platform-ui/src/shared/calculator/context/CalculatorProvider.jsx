import { useCallback, useMemo, useState } from "react";

import CalculatorModal from "../components/CalculatorModal";
import CalculatorContext from "./CalculatorContext";

function CalculatorProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openCalculator = useCallback(() => {
    setOpen(true);
  }, []);

  const closeCalculator = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      open,
      openCalculator,
      closeCalculator,
    }),
    [
      open,
      openCalculator,
      closeCalculator,
    ],
  );

  return (
    <CalculatorContext.Provider value={value}>
      {children}

      <CalculatorModal
        open={open}
        onClose={closeCalculator}
      />
    </CalculatorContext.Provider>
  );
}

export default CalculatorProvider;