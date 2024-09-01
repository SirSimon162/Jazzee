"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import useProductStore from "@/store/product-store";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
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

  const [value1, setValue1] = useState({});
  const [value2, setValue2] = useState({});
  const [value3, setValue3] = useState({});

  const requiredKeys = ["req1", "req2", "req3"];

  const [quoteStatus, setQuoteStatus] = useState(false);

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

  async function requestQuote(payload) {
    setQuoteStatus(true);
    let callPayload = {};
    let start = 1;
    Object.entries(payload).map(([key, value]) => {
      if (key != "Price") {
        if (start == 1) {
          callPayload["key1"] = { key: key, value: value };
          start++;
        }
        if (start == 2) {
          callPayload["key2"] = { key: key, value: value };
        }
      }
    });
    callPayload["price"] = payload.Price;
    callPayload["categoryName"] = schema.categoryName;
    console.log(callPayload);

    const response = await fetch("/api/buyer/request-quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(callPayload),
    });

    if (response.ok) {
      setQuoteStatus("successful");
      setOrderPlaced(true);
    }
  }

  useEffect(() => {
    getProviders(id);
    getQuoteSchema(id);
  }, [id]);

  const handleCloseModal = () => {
    router.push("/marketplace");
  };

  const ProductDetails = ({ details }) => {
    const notDisplayedKeys = [
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
        {schema["categoryName"]}
      </motion.h1>
      <motion.p
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="text-gray-400 mb-6"
      >
        {schema["categorySlug"]}
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
            const formData = new FormData(e.target);
            const data = {};

            formData.forEach((value, key) => {
              data[key] = value;
            });

            console.log({ form: data });
            requestQuote(data);
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
                    <label className="block text-sm mb-2 w-full text-gray-300">
                      {field}
                    </label>
                    <input
                      type="text"
                      name={field}
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
            whileTap={{ scale: 0.95 }}
            className="mt-4 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full"
          >
            Request Quote
          </motion.button>
        </form>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {products.map((product) => (
          <motion.div
            key={product._id}
            className="p-6 bg-gray-800 rounded-lg shadow-lg mb-4 border border-[#0e0e10] hover:border-blue-500 hover:shadow-sm hover:shadow-blue-500"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <h3 className="text-2xl font-semibold mb-4 text-white">
              {product.productName}
            </h3>
            <h5 className="text-lg font-semibold text-gray-200 mb-1">
              {product.categoryName}
            </h5>
            <ProductDetails details={product} />
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
                We are requesting quotations on your requirements.
              </p>
              <button
                onClick={handleCloseModal}
                className="mt-4 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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

export default Page;
