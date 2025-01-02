// cart.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [] // 使用数组存储购物车项，每个项是一个对象
  }),
  actions: {
    initCart() {
      const storedCart = localStorage.getItem('cartItems');
      this.cartItems = storedCart ? JSON.parse(storedCart) : [];
    },
    addToCart(product) {
      const existingProduct = this.cartItems.find(item => item.ProductID === product.ProductID);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        this.cartItems.push({ ...product, quantity: 1 });
      }
      this.saveCartToLocalStorage();
    },
    removeFromCart(productId) {
      const indexToRemove = this.cartItems.findIndex(item => item.ProductID === productId);
      if (indexToRemove !== -1) {
        this.cartItems.splice(indexToRemove, 1);
      }
      this.saveCartToLocalStorage();
    },
    clearCart() {
      this.cartItems = [];
      this.saveCartToLocalStorage();
      localStorage.removeItem('cartItems');
    },
    updateProductQuantity({ ProductID, Quantity }) {
      const product = this.cartItems.find(item => item.ProductID === ProductID);
      if (product) {
        product.quantity = Quantity;
      }
      this.saveCartToLocalStorage();
    },
    updateCart(newCart) {
      this.cartItems = newCart;
      this.saveCartToLocalStorage();
    },
    saveCartToLocalStorage() {
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }
  },
  persist: true,
  getters: {
    cartTotal: (state) => {
      return state.cartItems.reduce((total, item) => total + item.Price * item.quantity, 0);
    }
  },
  persist: true
},
{
  persist: true
}
);