export function showToast(message, type = "success") {
    const toast = document.createElement("div");

    toast.className = `Toast Toast--${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 200);
    }, 2200);
}