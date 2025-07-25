document.addEventListener("alpine:init", () => {
  // Format Rupiah global
  Alpine.magic(
    "rupiah",
    () => (number) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(number)
  );

  // Cart Store
  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
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

  // Produk Data
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
      this.$store.cart.add(item);
      const cart = document.querySelector(".shopping-cart");
      cart?.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => document.querySelector("#name")?.focus(), 500);
    },
  }));

  // Checkout Form
  Alpine.data("checkoutForm", () => ({
    customer: {
      name: "",
      email: "",
      phone: "",
    },
    get canSubmit() {
      return (
        this.customer.name.trim() &&
        this.customer.email.trim() &&
        this.customer.phone.trim()
      );
    },
    submitCheckout() {
      if (!this.canSubmit) {
        alert("Harap isi semua data pelanggan!");
        return;
      }

      const items = Alpine.store("cart").items;
      const total = Alpine.store("cart").total;
      const message = `Data Customer
Nama: ${this.customer.name}
Email: ${this.customer.email}
No HP: ${this.customer.phone}

Pesanan:
${items
  .map(
    (i) =>
      `${i.name} (${i.quantity} x ${this.rupiah(i.price)}) = ${this.rupiah(
        i.total
      )}`
  )
  .join("\n")}

Total: ${this.rupiah(total)}

Terima kasih!`;

      const waNumber = "6281224823364";
      window.open(
        `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    },
    rupiah(number) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(number);
    },
  }));
});
