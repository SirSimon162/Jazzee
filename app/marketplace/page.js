"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/buyer/get-products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (response.ok) {
          setProducts(data.result);
          console.log(data.result);
        } else {
          console.error("Failed to fetch products:", data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (!product || typeof product.productName !== "string") {
      console.error("Invalid product or product name", product);
      return false;
    }
    return product.productName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-start w-full bg-black bg-[radial-gradient(circle_900px_at_50%_300px,#6533ee78,transparent)] pb-20">
      <div className="flex flex-col gap-4 sm:gap-8 p-4 justify-center items-center mb-6 bg-[url(https://res.cloudinary.com/darx97f61/image/upload/v1724614437/bg-blur_kafhg5.jpg)] w-[90%] bg-no-repeat bg-cover h-96 mt-20 sm:mt-32 rounded-lg">
        <h1 className="text-2xl sm:text-6xl font-bold text-white text-center tracking-wider">
          Jazzee Marketplace
        </h1>
        <motion.input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-2xl p-2 sm:p-4 border border-gray-300 rounded-md bg-gray-200 focus:outline-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
      </div>
      {filteredProducts.length > 0 ? (
        <motion.div
          className="w-full px-4 sm:px-0"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { staggerChildren: 0.2, delayChildren: 0.1 },
            },
          }}
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              layoutId={product._id}
              onClick={() => setSelectedProductId(product._id)}
              whileHover={{ scale: 1.01 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 cursor-pointer mb-4 p-4 rounded-lg hover:shadow-sm transition-shadow duration-200 bg-[#0e0e10] w-full max-w-[90%] mx-auto border border-1 border-[#0e0e10] hover:border-blue-500 shadow-blue-400 hover:shadow-blue-500"
            >
              <div className="flex flex-col">
                <motion.h2 className="text-2xl font-bold mb-1 text-white tracking-wide">
                  {product.productName}
                </motion.h2>
                <p className="text-gray-200 mb-4">{product.categoryName}</p>
                <motion.button
                  onClick={() => setSelectedProductId(product._id)}
                  className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 transition-colors px-7 max-w-[150px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore
                </motion.button>
              </div>
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-4 sm:mb-0">
                <div className="flex-1">
                  <h5 className="text-gray-300 font-semibold">
                    Issue Tracking: {product["Issue Tracking"]}
                  </h5>
                  <p className="text-sm text-gray-300">
                    CI/CD: {product["CI/CD Option"]}
                  </p>
                  <p className="text-sm text-gray-300">
                    Pricing: {product.Pricing}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div>No products found.</div>
      )}

      <AnimatePresence>
        {selectedProductId && (
          <>
            <motion.div
              layoutId={selectedProductId}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-[#0e0e10] p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] sm:max-h-screen overflow-y-auto overflow-x-hidden"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              >
                {products
                  .filter((product) => product._id === selectedProductId)
                  .map((product) => (
                    <div key={product._id}>
                      <div className="flex justify-between items-center mb-4">
                        <motion.h2 className="text-2xl font-bold text-white text-center">
                          {product.productName}
                        </motion.h2>
                        <motion.button
                          onClick={() => setSelectedProductId(null)}
                          className="flex items-center justify-center w-8 h-8 rounded-full text-blue-500 transition-colors"
                          whileHover={{ scale: 1.2, rotate: 90 }}
                        >
                          <AiOutlineClose size={20} />
                        </motion.button>
                      </div>
                      <motion.div
                        className="mb-4 p-4 border border-[#0e0e10] hover:border-blue-500 rounded-md"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <motion.h5 className="text-xl font-semibold text-gray-200">
                          Issue Tracking: {product["Issue Tracking"]}
                        </motion.h5>
                        <motion.p className="text-gray-300">
                          CI/CD Options: {product["CI/CD Option"]}
                        </motion.p>
                        <motion.p className="text-gray-300">
                          Pricing: {product.Pricing}
                        </motion.p>
                      </motion.div>
                      <motion.a
                        href={`/product/${product._id}`}
                        className="mt-6 p-3 w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center block"
                        whileHover={{ scale: 1.02 }}
                      >
                        Get a Quote
                      </motion.a>
                    </div>
                  ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
