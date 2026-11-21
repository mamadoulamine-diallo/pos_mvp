import { createUser, updateUser } from "./user-api.js";
import { showToast } from "../components/toast.js";

document.addEventListener("DOMContentLoaded", () => {
  const addOverlay = document.querySelector(".AddUserOverlay");
  const editOverlay = document.querySelector(".EditUserOverlay");

  const addButton = document.querySelector(".Users-addButton");
  const editButtons = document.querySelectorAll(".UserCard-edit");

  const addForm = document.querySelector(".AddUserForm");
  const editForm = document.querySelector(".EditUserForm");

  function openOverlay(overlay) {
    overlay?.classList.add("open");
  }

  function openOverlay(overlay) {
    overlay?.classList.add("open");
  }

  function closeOverlay(overlay) {
    overlay?.classList.remove("open");
  }

  function initOverlayClosing(overlay) {
    const closeButton = overlay?.querySelector(".Overlay-close");
    const backdrop = overlay?.querySelector(".Overlay-backdrop");

    closeButton?.addEventListener("click", () => {
      closeOverlay(overlay);
    });

    backdrop?.addEventListener("click", () => {
      closeOverlay(overlay);
    });
  }

  initOverlayClosing(addOverlay);
  initOverlayClosing(editOverlay);

  function reloadAfterToast() {
    setTimeout(() => window.location.reload(), 650);
  }

  addButton?.addEventListener("click", () => {
    openOverlay(addOverlay);
  });

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".UserCard");

      editForm.userId.value = card.dataset.id;
      editForm.fullName.value = card.dataset.name || "";
      editForm.email.value = card.dataset.email || "";
      editForm.pinCode.value = card.dataset.pin || "";
      editForm.role.value = card.dataset.role || "VENDEUR";
      editForm.active.value = card.dataset.active === "true" ? "true" : "false";

      openOverlay(editOverlay);
    });
  });

  addForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(addForm);

    const payload = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      pinCode: formData.get("pinCode"),
      role: formData.get("role"),
    };

    try {
      await createUser(payload);
      showToast("Utilisateur créé avec succès");
      reloadAfterToast();
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
    }
  });

  editForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(editForm);
    const userId = formData.get("userId");

    const payload = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      pinCode: formData.get("pinCode"),
      role: formData.get("role"),
      active: formData.get("active") === "true",
    };

    try {
      await updateUser(userId, payload);
      showToast("Utilisateur modifié avec succès");
      reloadAfterToast();
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
    }
  });
});
