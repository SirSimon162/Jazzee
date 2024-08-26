import create from "zustand";

const useProductStore = create((set) => {
  return {
    products: [
      {
        id: "1",
        name: "Collab Platform",
        description: "Collaborate seamlessly with top tools.",
        providers: [
          {
            name: "GitHub",
            price: "$20/user/month",
            features: "Features A, B, C",
            gigs: "200GB storage",
            concurrency: "Unlimited repos",
          },
          {
            name: "GitLab",
            price: "$18/user/month",
            features: "Features D, E, F",
            gigs: "150GB storage",
            concurrency: "500 repos",
          },
          {
            name: "Bitbucket",
            price: "$15/user/month",
            features: "Features G, H, I",
            gigs: "100GB storage",
            concurrency: "200 repos",
          },
        ],
      },
      {
        id: "2",
        name: "Project Management Tool",
        description: "Manage your projects efficiently.",
        providers: [
          {
            name: "Trello",
            price: "$10/user/month",
            features: "Features X, Y, Z",
            gigs: "50GB storage",
            concurrency: "Unlimited boards",
          },
          {
            name: "Jira",
            price: "$25/user/month",
            features: "Features L, M, N",
            gigs: "200GB storage",
            concurrency: "Unlimited projects",
          },
          {
            name: "Asana",
            price: "$30/user/month",
            features: "Features P, Q, R",
            gigs: "150GB storage",
            concurrency: "Unlimited tasks",
          },
        ],
      },
    ],
    requestedOrders: [
      {
        id: "1",
        name: "Collab Platform",
        description: "Collaborate seamlessly with top tools.",
        quoteDetails: {
          initialPrice: "$25/user/month",
          loweredPrice: "$20/user/month",
        },
        providers: [
          {
            name: "GitHub",
            price: "$20/user/month",
            features: "Features A, B, C",
            gigs: "200GB storage",
            concurrency: "Unlimited repos",
          },
          {
            name: "GitLab",
            price: "$18/user/month",
            features: "Features D, E, F",
            gigs: "150GB storage",
            concurrency: "500 repos",
          },
          {
            name: "Bitbucket",
            price: "$15/user/month",
            features: "Features G, H, I",
            gigs: "100GB storage",
            concurrency: "200 repos",
          },
        ],
      },
    ],
    confirmedOrders: [
      {
        id: "1",
        name: "Project Management Tool",
        description: "Manage your projects efficiently.",
        quoteDetails: {
          initialPrice: "$20/user/month",
          loweredPrice: "$10/user/month",
        },
        providers: [
          {
            name: "Trello",
            price: "$10/user/month",
            features: "Features X, Y, Z",
            gigs: "50GB storage",
            concurrency: "Unlimited boards",
          },
        ],
      },
    ],
    setSelectedProduct: (product) => set({ selectedProduct: product }),
    setRequestedOrder: (product, quoteDetails) =>
      set((state) => {
        if (!state.requestedOrders.find((order) => order.id === product.id)) {
          const updatedOrder = {
            ...product,
            quoteDetails,
          };
          const updatedOrders = [...state.requestedOrders, updatedOrder];
          return { requestedOrders: updatedOrders };
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
        const updatedConfirmedOrders = [
          ...state.confirmedOrders,
          confirmedOrder,
        ];
        return {
          requestedOrders: updatedOrders,
          confirmedOrders: updatedConfirmedOrders,
        };
      }),
  };
});

export default useProductStore;
