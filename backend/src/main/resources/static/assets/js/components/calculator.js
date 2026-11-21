const calculatorTrigger = document.querySelector(".CalculatorTrigger");
const calculatorSheet = document.querySelector(".CalculatorSheet");
const calculatorBackdrop = document.querySelector(".CalculatorSheet-backdrop");
const calculatorClose = document.querySelector(".CalculatorSheet-close");
const calculatorDisplay = document.querySelector(".CalculatorSheet-display");
const calculatorButtons = document.querySelectorAll(".CalculatorSheet-grid button");

let calculation = "";

function openCalculator() {
  calculatorSheet.classList.add("open");
  calculatorSheet.setAttribute("aria-hidden", "false");
}

function closeCalculator() {
  calculatorSheet.classList.remove("open");
  calculatorSheet.setAttribute("aria-hidden", "true");
}

if (calculatorTrigger && calculatorSheet) {
  calculatorTrigger.addEventListener("click", openCalculator);
}

if (calculatorBackdrop) {
  calculatorBackdrop.addEventListener("click", closeCalculator);
}

if (calculatorClose) {
  calculatorClose.addEventListener("click", closeCalculator);
}

calculatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!calculatorDisplay) return;

    const value = button.textContent.trim();

    if (value === "C") {
      calculation = "";
      calculatorDisplay.textContent = "0";
      return;
    }

    if (value === "=") {
      try {
        const expression = calculation.replaceAll("×", "*").replaceAll("÷", "/");
        const result = Function(`"use strict"; return (${expression})`)();

        calculatorDisplay.textContent = result;
        calculation = String(result);
      } catch {
        calculatorDisplay.textContent = "Erreur";
        calculation = "";
      }

      return;
    }

    calculation += value;
    calculatorDisplay.textContent = calculation;
  });
});