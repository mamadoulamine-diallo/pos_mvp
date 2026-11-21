document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector(".PinLogin-input");
    const dots = document.querySelectorAll(".PinLogin-display span");
    const buttons = document.querySelectorAll(".PinKeyboard button");

    function updateDisplay() {
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index < input.value.length);
        });
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const value = button.dataset.value;
            const action = button.dataset.action;

            if (value && input.value.length < dots.length) {
                input.value += value;
            }

            if (action === "delete") {
                input.value = input.value.slice(0, -1);
            }

            updateDisplay();
        });
    });
});