document.addEventListener("alpine:init", () => {
  // Magic: Format Rupiah
  Alpine.magic(
    "rupiah",
    () => (number) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(number)
  );

  // Store: Cart
  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    visible: false,

    add(newItem) {
      const existing = this.items.find((i) => i.id === newItem.id);
      if (!existing) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
      } else {
        existing.quantity++;
        existing.total = existing.price * existing.quantity;
      }
      this.recalculate();
    },

    remove(id) {
      const existing = this.items.find((i) => i.id === id);
      if (!existing) return;

      if (existing.quantity > 1) {
        existing.quantity--;
        existing.total = existing.price * existing.quantity;
      } else {
        this.items = this.items.filter((i) => i.id !== id);
      }
      this.recalculate();
    },

    recalculate() {
      this.quantity = this.items.reduce((sum, i) => sum + i.quantity, 0);
      this.total = this.items.reduce((sum, i) => sum + i.total, 0);
    },

    setSingleItem(item, qty = 1) {
      this.items = [{ ...item, quantity: qty, total: item.price * qty }];
      this.recalculate();
    },

    clear() {
      this.items = [];
      this.total = 0;
      this.quantity = 0;
    },
  });

  // Data: Produk
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Basreng Keripik", img: "1.jpg", price: 15000 },
      { id: 2, name: "Cimol Balado", img: "2.jpg", price: 15000 },
      { id: 3, name: "Cipruk", img: "3.jpg", price: 15000 },
      { id: 4, name: "Basreng Balado", img: "4.jpg", price: 15000 },
      { id: 5, name: "Sistik Kiriwil", img: "5.jpg", price: 15000 },
    ],

    rupiah(number) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(number);
    },

    openBuyNow(item) {
      this.$store.cart.add(item); // Tambah item ke cart
      this.$store.cart.visible = true; // Trigger Alpine show cart

      const cartBtn = document.querySelector("#shopping-cart-button");
      cartBtn?.classList.add("highlight");
      setTimeout(() => cartBtn?.classList.remove("highlight"), 500);
    },
  }));
});
