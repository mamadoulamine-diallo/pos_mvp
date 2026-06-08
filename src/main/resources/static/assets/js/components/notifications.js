export function initNotifications() {
    const notification = document.querySelector(".HeaderNotification");
    const notificationTrigger = document.querySelector(".HeaderNotification-trigger");

    notificationTrigger?.addEventListener("click", (event) => {
        event.stopPropagation();
        notification?.classList.toggle("open");
    });

    document.addEventListener("click", () => {
        notification?.classList.remove("open");
    });

    notification?.addEventListener("click", (event) => {
        event.stopPropagation();
    });
}