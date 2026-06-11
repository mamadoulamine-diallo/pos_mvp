export function initNotifications() {
    const notification = document.querySelector(".HeaderNotification");
    const notificationTrigger = document.querySelector(".HeaderNotification-trigger");

    const account = document.querySelector(".HeaderAccount");
    const accountTrigger = document.querySelector(".HeaderAccount-trigger");

    notificationTrigger?.addEventListener("click", (event) => {
        event.stopPropagation();
        notification?.classList.toggle("open");
        account?.classList.remove("open");
    });

    accountTrigger?.addEventListener("click", (event) => {
        event.stopPropagation();
        account?.classList.toggle("open");
        notification?.classList.remove("open");
    });

    document.addEventListener("click", () => {
        notification?.classList.remove("open");
        account?.classList.remove("open");
    });

    notification?.addEventListener("click", (event) => event.stopPropagation());
    account?.addEventListener("click", (event) => event.stopPropagation());
}