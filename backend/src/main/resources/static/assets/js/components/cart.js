export function createCart({ onChange, onToast } = {}) {
  const cart = [];

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function loadCart() {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      cart.push(...JSON.parse(savedCart));
    }
  }

  function add(product) {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    onChange?.(cart);
    onToast?.(`${product.name} ajouté`);
  }

  function decrease(productId) {
    const item = cart.find((item) => item.id === productId);
    if (!item) return;

    item.quantity -= 1;

    if (item.quantity <= 0) {
      remove(productId);
      return;
    }

    saveCart();
    onChange?.(cart);
  }

  function increase(productId) {
    const item = cart.find((item) => item.id === productId);
    if (!item) return;

    item.quantity += 1;

    saveCart();
    onChange?.(cart);
  }

  function remove(productId) {
    const index = cart.findIndex((item) => item.id === productId);
    if (index === -1) return;

    cart.splice(index, 1);

    saveCart();
    onChange?.(cart);
    onToast?.("Article supprimé");
  }

  function clear() {
    cart.length = 0;

    saveCart();
    onChange?.(cart);
  }

  function getTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  function getQuantity() {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  function getItems() {
    return cart;
  }

  loadCart();

  return {
    add,
    decrease,
    increase,
    remove,
    clear,
    getTotal,
    getQuantity,
    getItems,
  };
}