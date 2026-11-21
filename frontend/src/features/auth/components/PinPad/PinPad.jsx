import { Check, Delete } from "lucide-react";

import "./PinPad.scss";

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

function PinPad({
  value,
  maxLength = 4,
  disabled = false,
  onChange,
  onSubmit,
}) {
  function addDigit(digit) {
    if (disabled || value.length >= maxLength) {
      return;
    }

    onChange(`${value}${digit}`);
  }

  function removeDigit() {
    if (disabled) {
      return;
    }

    onChange(value.slice(0, -1));
  }

  return (
    <div className="PinPad">
      <div
        className="PinPad-display"
        aria-label={`${value.length} chiffres saisis`}
      >
        {Array.from({
          length: maxLength,
        }).map((_, index) => (
          <span
            key={index}
            className={
              index < value.length
                ? "PinPad-dot PinPad-dot--filled"
                : "PinPad-dot"
            }
          />
        ))}
      </div>

      <div className="PinPad-grid">
        {numbers.map((number) => (
          <button
            key={number}
            type="button"
            disabled={disabled}
            onClick={() => addDigit(number)}
          >
            {number}
          </button>
        ))}

        <button
          type="button"
          className="PinPad-delete"
          disabled={disabled || value.length === 0}
          aria-label="Effacer un chiffre"
          onClick={removeDigit}
        >
          <Delete size={22} aria-hidden="true" />
        </button>

        <button type="button" disabled={disabled} onClick={() => addDigit("0")}>
          0
        </button>

        <button
          type="button"
          className="PinPad-submit"
          disabled={disabled || value.length !== maxLength}
          aria-label="Se connecter"
          onClick={onSubmit}
        >
          <Check size={24} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default PinPad;
