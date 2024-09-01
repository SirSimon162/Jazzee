"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "@/store/user-store";

const mockData = {
  products: [
    { id: 1, name: "Product A", price: "$150", gigs: "50", concurrency: "10" },
    { id: 2, name: "Product B", price: "$200", gigs: "70", concurrency: "15" },
  ],
  requestedOrders: [
    {
      id: 1,
      name: "Product A",
      quoteDetails: { initialPrice: "$150" },
    },
  ],
  confirmedOrders: [
    {
      id: 2,
      name: "Product B",
      quoteDetails: { initialPrice: "$200", confirmedPrice: "$180" },
    },
  ],
};

const SellerDashboard = () => {
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [schemaData, setSchemaData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formFields, setFormFields] = useState({});
  const [newProduct, setNewProduct] = useState({});
  const [confirmingOrder, setConfirmingOrder] = useState(null);
  const [priceInput, setPriceInput] = useState("");
  const [products, setProducts] = useState([]);
  const [openBids, setOpenBids] = useState([]);
  const [isProductListed, setIsProductListed] = useState(false);

  const [id, setId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [productName, setProductName] = useState("");

  useEffect(() => {
  for (let i = 0; i < products.length; i++) {
    let currentProduct = products[i];
    if (currentProduct['categoryName'] === categoryName) {
      setProductName(currentProduct['productName']);
      break; // Exit the loop once a match is found
    }
  }
}, [categoryName, products]);
  

  const { userInfo } = useAuthStore((state) => ({
    userInfo: state.userInfo,
  }));

  const fetchSchema = async () => {
    try {
      const response = await fetch("/api/seller/get-master-schema");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setSchemaData(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/seller/get-products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data.result || []);
      console.log(data.result);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const getOpenBids = async () => {
    try {
      const response = await fetch("/api/seller/get-openbids");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setOpenBids(data.filteredOrders || []);
      console.log("bids", data.filteredOrders);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };



  useEffect(() => {
    fetchSchema();
    fetchProducts();
    getOpenBids();
  }, []);

  const handleAddProduct = () => {
    setShowAddProductModal(true);
  };
  const handleConfirmOrder = (product) => {
    setConfirmingOrder(true);
  };

  const handleSaveNewProduct = async () => {
    try {
      const { userInfo } = useAuthStore.getState();
      const productPayload = {
        ...newProduct,
        sellerCustomName: userInfo.name,
        categorySlug: selectedCategory,
        categoryName: schemaData.find(
          (schema) => schema.categorySlug === selectedCategory
        ).categoryName,
      };

      console.log(productPayload);

      console.log("Attempting to list product:", productPayload);

      const response = await fetch("/api/seller/list-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product: productPayload }),
      });

      if (response.ok) {
        console.log("Product listed successfully");
        setShowAddProductModal(false);
        setNewProduct({});
        setIsProductListed(true);
        fetchProducts();
      } else {
        const errorData = await response.json();
        console.error("Failed to list product:", errorData.message);
      }
    } catch (error) {
      console.error("Error listing product:", error);
    }
  };

  const handleCategoryChange = (event) => {
    const categorySlug = event.target.value;
    setSelectedCategory(categorySlug);

    const selectedSchema = schemaData.find(
      (schema) => schema.categorySlug === categorySlug
    );
    setFormFields(selectedSchema?.required || {});
  };

  const handleFieldChange = (key, value) => {
    setNewProduct((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleInputPrice = async () => {
    try {
      const response = await fetch("/api/seller/place-bid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
          price: priceInput,
          productName: productName,
        }),
      });

      if (response.ok) {
        setConfirmingOrder(null);
        setPriceInput("");
        getOpenBids();
      } else {
        const errorData = await response.json();
        console.error("Failed to submit price:", errorData.message);
      }
    } catch (error) {
      console.error("Error submitting price:", error);
    }
  };

  const ProductDetails = ({ details }) => {
    const notDisplayedKeys = [
      "Price",
      "price",
      "_id",
      "sellerCustomName",
      "categorySlug",
      "categoryName",
      "productName",
      "sellerCode",
    ];

    return (
      <div>
        {Object.entries(details).map(([key, value]) => {
          if (notDisplayedKeys.some((item) => item === key)) {
            return null;
          }
          return (
            <p key={key} className="text-lg text-gray-400 mb-2">
              <strong>{key}:</strong> {value}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full pt-32 pb-20 px-6 bg-gray-900 text-white bg-[radial-gradient(circle_900px_at_50%_600px,#6533ee78,transparent)]">
      <motion.h1
        className="text-4xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Your Organization: {userInfo.name}
      </motion.h1>
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Your Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length === 0 && <p>No Products.</p>}
          {products.map((product) => (
            <motion.div
              key={product._id}
              className="p-6 bg-gray-800 rounded-lg shadow-lg mb-4 border border-[#0e0e10] hover:border-blue-500 hover:shadow-sm hover:shadow-blue-500"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h3 className="text-2xl font-semibold mb-4">
                {product.productName}
              </h3>
              <h5 className="text-lg font-semibold text-gray-200 mb-1">
                {product.categoryName}
              </h5>
              <ProductDetails details={product} />
            </motion.div>
          ))}
          <motion.button
            className="p-6 bg-gray-800 text-white rounded-lg shadow-lg mb-4 flex items-center justify-center hover:bg-blue-900 transition-colors border border-dashed border-blue-500"
            onClick={handleAddProduct}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            Add New Product
          </motion.button>
        </div>
        <motion.button
          className="p-3 mt-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          onClick={() => alert("Navigate to Analytics and Insights page")}
        >
          Go to AI Analytics and Insights
        </motion.button>
      </section>
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Requested Quotes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {openBids.length === 0 && <p>No Pending Requests.</p>}
          {openBids.map((product) => (
            <motion.div
              key={product._id}
              className="p-6 bg-gray-800 rounded-lg shadow-lg mb-4 border border-[#0e0e10] hover:border-blue-500 hover:shadow-sm hover:shadow-blue-500"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h3 className="text-2xl font-semibold mb-4">
                {product.categoryName}
              </h3>
              <p className="text-lg font-semibold text-yellow-400">
                Requested Price: {product.details.price}
              </p>
              <ProductDetails details={product.details} />
              <motion.button
                onClick={() => {
                  handleConfirmOrder();
                  setId(product._id);
                  setCategoryName(product.categoryName);
                }}
                className="p-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                Make a Bid
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Confirmed Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockData.confirmedOrders.length === 0 && <p>No confirmed orders.</p>}
          {mockData.confirmedOrders.map((product) => (
            <motion.div
              key={product.id}
              className="p-6 bg-gray-800 rounded-lg shadow-lg mb-4 border border-[#0e0e10] hover:border-blue-500 hover:shadow-sm hover:shadow-blue-500"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h3 className="text-2xl font-semibold mb-4">{product.name}</h3>
              <p className="text-lg font-semibold text-yellow-400">
                Original Price: {product.quoteDetails.initialPrice}
              </p>
              <p className="text-lg font-semibold text-green-400 mt-2">
                Confirmed Price: {product.quoteDetails.confirmedPrice}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
      <AnimatePresence>
        {showAddProductModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg flex flex-col text-white"
            >
              <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
              <select
                onChange={handleCategoryChange}
                value={selectedCategory}
                className="p-2 mb-4 bg-transparent border-b-2 border-blue-500 focus:outline-none"
              >
                <option value="" className="bg-gray-900 text-white">
                  Select Product Type
                </option>
                {schemaData.map((schema) => (
                  <option
                    key={schema._id}
                    value={schema.categorySlug}
                    className="bg-gray-900 text-white"
                  >
                    {schema.categoryName}
                  </option>
                ))}
              </select>
              <label>Product Name</label>
              <input
                type={"text"}
                placeholder={"Product Name"}
                onChange={(e) =>
                  handleFieldChange("productName", e.target.value)
                }
                className="p-2 mb-4 bg-transparent border-b-2 border-blue-500 focus:outline-none"
              />
              {selectedCategory &&
                Object.keys(formFields).map((key) => {
                  const field = formFields[key];
                  return (
                    <div key={key} className="w-full">
                      <label className="block text-sm mb-2 w-full">
                        {field.keyName}
                      </label>
                      <input
                        type={field.valueType === "Number" ? "number" : "text"}
                        placeholder={field.placeholder}
                        onChange={(e) =>
                          handleFieldChange(field.keyName, e.target.value)
                        }
                        className="p-2 mb-4 bg-transparent border-b-2 border-blue-500 focus:outline-none w-full"
                      />
                    </div>
                  );
                })}
              <div className="flex justify-end">
                <motion.button
                  onClick={handleSaveNewProduct}
                  className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  Add Product
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isProductListed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center text-white"
            >
              <AiOutlineCheckCircle className="text-4xl text-green-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Product Listed!</h2>
              <p className="text-center mb-4">
                Your product has been successfully listed.
              </p>
              <motion.button
                onClick={() => setIsProductListed(false)}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {confirmingOrder && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg"
              initial={{ y: "-50vh" }}
              animate={{ y: 0 }}
              exit={{ y: "50vh" }}
            >
              <h2 className="text-2xl font-bold mb-4">
                Confirm Order for {confirmingOrder.productName}
              </h2>
              <ProductDetails details={confirmingOrder} />
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">
                  Enter Price
                </label>
                <input
                  type="text"
                  className="w-full p-2 bg-gray-700 text-white rounded-md"
                  placeholder="Price"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                onClick={handleInputPrice}
              >
                Submit Price
              </button>
              <button
                type="button"
                className="w-full mt-4 bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
                onClick={() => setConfirmingOrder(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerDashboard;
