"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import useProductStore from "@/store/product-store";

const Page = () => {
  const { id } = useParams();
  const [quoteDetails, setQuoteDetails] = useState({
    price: "",
    gigs: "",
    concurrency: "",
    urgent: false,
    selectedProviders: [],
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [products, setProducts] = useState([]);
  const [schema, setSchema] = useState({});
  const requiredKeys = ["req1", "req2", "req3"];

  async function getProviders(id) {
    const productsRes = await fetch("/api/buyer/get-products");
    const productData = await productsRes.json();
    const productArray = productData.result;
    let providersList = [];
    for (let i = 0; i < productArray.length; i++) {
      let currentProduct = productArray[i];
      if (currentProduct["categorySlug"] == id) {
        providersList.push(currentProduct);
      }
    }
    setProducts(providersList);
    console.log(providersList);
    console.log(providersList.length);
  }
  console.log({ products });
  async function getQuoteSchema(id) {
    const productsRes = await fetch("/api/buyer/get-quote-schema");
    const quoteSchema = await productsRes.json();

    const schemaArray = quoteSchema.result;
    let requiredSchema = {};

    for (let i = 0; i < schemaArray.length; i++) {
      let currentSchema = schemaArray[i];
      if (currentSchema.categorySlug == id) {
        requiredSchema = currentSchema;
      }
    }
    setSchema(requiredSchema);
    console.log(requiredSchema);
  }

  useEffect(() => {
    getProviders(id);
    getQuoteSchema(id);
  }, [id]);

  const handlePlaceOrder = () => {
    useProductStore.getState().setRequestedOrder(product, quoteDetails);
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
    }, 3000);
  };

  if (!products) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 p-6">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full h-full flex flex-col items-center justify-center bg-gray-900 px-6 pt-28 pb-12 bg-[radial-gradient(circle_900px_at_50%_600px,#6533ee78,transparent)]">
      <motion.h1
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-2xl md:text-4xl font-bold text-white mb-0 capitalize"
      >
        Hey
      </motion.h1>
      <motion.p
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="text-gray-400 mb-6"
      >
        Hey
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="w-full max-w-6xl mb-6"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePlaceOrder();
          }}
          className="bg-[#0e0e10] p-6 rounded-lg shadow-lg w-full"
        >
          <div>
            <label className="text-lg block text-gray-300">Providers</label>
          </div>
          <div className="mt-4">
            {Object.keys(schema).map((key) => {
              const field = schema[key];
              if (requiredKeys.includes(key)) {
                return (
                  <div key={key} className="w-full">
                    <label className="block text-sm mb-2 w-full">{field}</label>
                    <input
                      type="text"
                      placeholder={field}
                      className="p-2 mb-4 bg-transparent border-b-2 border-blue-500 focus:outline-none w-full text-white"
                    />
                  </div>
                );
              }

              return null;
            })}
          </div>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            className="mt-4 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full"
          >
            Request Quote
          </motion.button>
        </form>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {products.map((provider, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="p-6 bg-[#0e0e10] rounded-lg shadow-lg flex flex-col justify-between border border-[#0e0e10] hover:border-blue-500 hover:shadow-sm hover:shadow-blue-500"
          >
            <h2 className="text-2xl font-semibold text-white mb-4">
              {provider.name}
            </h2>
            <p className="text-gray-300">{provider.price}</p>
            <p className="text-gray-400">Features: {provider.features}</p>
            <p className="text-gray-400">Storage: {provider.gigs}</p>
            <p className="text-gray-400">Concurrency: {provider.concurrency}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {orderPlaced && (
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
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg flex flex-col items-center"
            >
              <AiOutlineCheckCircle size={60} className="text-blue-500" />
              <p className="mt-4 text-xl font-semibold text-center">
                Auction will start soon
                <br />
                We will notify you over email.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
