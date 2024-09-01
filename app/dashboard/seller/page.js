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
  const [otpVerified, setOtpVerified] = useState(false);

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
      console.log(err)
    }
  };

  useEffect(() => {
    fetchSchema();
  }, []);

  const handleAddProduct = () => {
    setShowAddProductModal(true);
  };

  const handleConfirmOrder = (productId) => {
    setConfirmingOrder(productId);
  };

  const handleSaveNewProduct = () => {
    mockData.products.push({
      id: mockData.products.length + 1,
      ...newProduct,
    });
    setShowAddProductModal(false);
    setNewProduct({ name: "", price: "", gigs: "", concurrency: "" });
  };

  const handleInputPrice = () => {
    setConfirmingOrder(null);
  };

  const { userInfo } = useAuthStore((state) => ({
    userInfo: state.userInfo,
  }));

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
          {mockData.products.map((product) => (
            <motion.div
              key={product.id}
              className="p-6 bg-gray-800 rounded-lg shadow-lg mb-4 border border-[#0e0e10] hover:border-blue-500 hover:shadow-sm hover:shadow-blue-500"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
              <p>Price: {product.price}</p>
              <p>Gigs: {product.gigs}</p>
              <p>Concurrency: {product.concurrency}</p>
            </motion.div>
          ))}
          <motion.button
            className="p-6 bg-blue-600 text-white rounded-lg shadow-lg mb-4 flex items-center justify-center hover:bg-blue-700 transition-colors"
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
          Go to Analytics and Insights
        </motion.button>
      </section>
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Requested Quotes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockData.requestedOrders.length === 0 && <p>No requested quotes.</p>}
          {mockData.requestedOrders.map((product) => (
            <motion.div
              key={product.id}
              className="p-6 bg-gray-800 rounded-lg shadow-lg mb-4 border border-[#0e0e10] hover:border-blue-500 hover:shadow-sm hover:shadow-blue-500"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h3 className="text-2xl font-semibold mb-4">{product.name}</h3>
              <p className="text-lg font-semibold text-yellow-400">
                Entered Price: {product.quoteDetails.initialPrice}
              </p>

              <motion.button
                onClick={() => handleConfirmOrder(product.id)}
                className="p-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                Enter Price for Buyer
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
                <option value="">Select Product Type</option>
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
              {selectedCategory &&
                Object.keys(formFields).map((key) => {
                  const field = formFields[key];
                  return (
                    <input
                      key={key}
                      type={field.valueType === "Number" ? "number" : "text"}
                      placeholder={field.placeholder}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      className="p-2 mb-4 bg-transparent border-b-2 border-blue-500 focus:outline-none"
                    />
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
        {confirmingOrder && (
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
              <h2 className="text-2xl font-semibold mb-4">
                Enter Price for Buyer
              </h2>
              <input
                type="text"
                placeholder="Enter Price"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className="p-2 mb-4 bg-transparent border-b-2 border-blue-500 focus:outline-none"
              />
              <div className="flex justify-end">
                <motion.button
                  onClick={handleInputPrice}
                  className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  Submit Price
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerDashboard;
