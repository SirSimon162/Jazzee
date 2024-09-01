import create from "zustand";

const useProductStore = create((set) => ({
  products: [],
  requestedOrders: [],
  confirmedOrders: [],
  selectedProduct: null,
  setProducts: (products) => set({ products }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setRequestedOrder: (product, quoteDetails) =>
    set((state) => {
      if (!state.requestedOrders.find((order) => order.id === product.id)) {
        const updatedOrder = {
          ...product,
          quoteDetails,
        };
        return {
          requestedOrders: [...state.requestedOrders, updatedOrder],
        };
      }
      return state;
    }),
  confirmOrder: (productId) =>
    set((state) => {
      const updatedOrders = state.requestedOrders.filter(
        (order) => order.id !== productId
      );
      const confirmedOrder = state.products.find(
        (product) => product.id === productId
      );
      if (confirmedOrder) {
        return {
          requestedOrders: updatedOrders,
          confirmedOrders: [...state.confirmedOrders, confirmedOrder],
        };
      }
      return state;
    }),
}));

export default useProductStore;
