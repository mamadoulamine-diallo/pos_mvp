import { useContext } from "react";

import CalculatorContext from "../context/CalculatorContext";

export default function useCalculator() {
  const context = useContext(CalculatorContext);

  if (!context) {
    throw new Error(
      "useCalculator doit être utilisé à l'intérieur de CalculatorProvider.",
    );
  }

  return context;
}