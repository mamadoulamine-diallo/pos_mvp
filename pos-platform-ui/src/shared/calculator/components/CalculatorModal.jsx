import { useEffect, useState } from "react";

import "../styles/calculator.scss";

const buttons = [
  "7",
  "8",
  "9",
  "÷",
  "4",
  "5",
  "6",
  "×",
  "1",
  "2",
  "3",
  "-",
  "0",
  "C",
  "=",
  "+",
];

const operators = new Set(["+", "-", "×", "÷"]);

function calculateExpression(expression) {
  const normalized = expression
    .replaceAll("×", "*")
    .replaceAll("÷", "/");

  if (!/^[0-9+\-*/. ]+$/.test(normalized)) {
    throw new Error("Expression invalide");
  }

  const tokens =
    normalized.match(/(?:\d+(?:\.\d+)?)|[+\-*/]/g);

  if (!tokens || tokens.join("") !== normalized.replaceAll(" ", "")) {
    throw new Error("Expression invalide");
  }

  const values = [];
  const operations = [];

  const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
  };

  function applyOperation() {
    const operator = operations.pop();
    const right = values.pop();
    const left = values.pop();

    if (
      operator === undefined ||
      left === undefined ||
      right === undefined
    ) {
      throw new Error("Expression invalide");
    }

    if (operator === "+") {
      values.push(left + right);
      return;
    }

    if (operator === "-") {
      values.push(left - right);
      return;
    }

    if (operator === "*") {
      values.push(left * right);
      return;
    }

    if (right === 0) {
      throw new Error("Division par zéro");
    }

    values.push(left / right);
  }

  tokens.forEach((token) => {
    if (!Number.isNaN(Number(token))) {
      values.push(Number(token));
      return;
    }

    while (
      operations.length > 0 &&
      precedence[operations.at(-1)] >= precedence[token]
    ) {
      applyOperation();
    }

    operations.push(token);
  });

  while (operations.length > 0) {
    applyOperation();
  }

  if (values.length !== 1 || !Number.isFinite(values[0])) {
    throw new Error("Expression invalide");
  }

  return values[0];
}

function CalculatorModal({ open, onClose }) {
  const [calculation, setCalculation] = useState("");

  useEffect(() => {
    function handleKeyDown(event) {
      if (!open) {
        return;
      }

      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open, onClose]);

  function handleButtonClick(value) {
    if (value === "C") {
      setCalculation("");
      return;
    }

    if (value === "=") {
      if (!calculation) {
        return;
      }

      try {
        const result = calculateExpression(calculation);

        setCalculation(String(result));
      } catch {
        setCalculation("Erreur");
      }

      return;
    }

    setCalculation((currentValue) => {
      if (currentValue === "Erreur") {
        return operators.has(value)
          ? ""
          : value;
      }

      const lastCharacter = currentValue.at(-1);

      if (
        operators.has(value) &&
        operators.has(lastCharacter)
      ) {
        return `${currentValue.slice(0, -1)}${value}`;
      }

      return `${currentValue}${value}`;
    });
  }

  return (
    <div
      className={
        open
          ? "CalculatorSheet open"
          : "CalculatorSheet"
      }
      aria-hidden={!open}
    >
      <button
        type="button"
        className="CalculatorSheet-backdrop"
        aria-label="Fermer la calculatrice"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />

      <section
        className="CalculatorSheet-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calculator-title"
      >
        <div className="CalculatorSheet-handle" />

        <div className="CalculatorSheet-header">
          <h2
            id="calculator-title"
            className="CalculatorSheet-title"
          >
            Calculatrice
          </h2>

          <button
            className="CalculatorSheet-close"
            type="button"
            aria-label="Fermer la calculatrice"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div
          className="CalculatorSheet-display"
          aria-live="polite"
        >
          {calculation || "0"}
        </div>

        <div className="CalculatorSheet-grid">
          {buttons.map((button) => (
            <button
              key={button}
              type="button"
              onClick={() =>
                handleButtonClick(button)
              }
            >
              {button}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CalculatorModal;