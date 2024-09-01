"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Page = () => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [slug, setSlug] = useState("");
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
          const groupedData = data.result.reduce((acc, item) => {
            if (!acc[item.categoryName]) {
              acc[item.categoryName] = [];
            }
            acc[item.categoryName].push(item);
            return acc;
          }, {});
          setGroupedProducts(groupedData);
          console.log("groupedData", groupedData);
          setSelectedCategory(Object.keys(groupedData)[0]);
        } else {
          console.error("Failed to fetch products:", data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const renderProductDetails = (product) => {
    const detailKeys = Object.keys(product).filter(
      (key) =>
        key !== "_id" &&
        key !== "categorySlug" &&
        key !== "categoryName" &&
        key !== "productName" &&
        key !== "sellerCustomName" &&
        key !== "sellerCode"
    );

    return detailKeys.map((key) => (
      <p key={key} className="text-gray-300">
        {key.replace(/([A-Z])/g, " $1")}: {product[key]}
      </p>
    ));
  };

  useEffect(() => {
    if (selectedCategory) {
      const products = groupedProducts[selectedCategory] || [];
      if (products[0]) {
        setSlug(products[0]["categorySlug"]);
      }
    }
  }, [selectedCategory, groupedProducts]);

  const renderProducts = (category) => {
    const products = groupedProducts[category] || [];
    return (
      <div className="space-y-4 mt-4">
        {products.map((product) => (
          <motion.div
            key={product._id}
            className="p-4 border border-gray-900 bg-gray-900 hover:border-blue-500 rounded-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-gray-200">
              {product.productName}
            </h3>
            {renderProductDetails(product)}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start w-full bg-black bg-[radial-gradient(circle_900px_at_50%_300px,#6533ee78,transparent)] pb-20">
      <div className="flex flex-col gap-4 sm:gap-8 p-4 justify-center items-center mb-6 bg-[url(https://res.cloudinary.com/darx97f61/image/upload/v1724614437/bg-blur_kafhg5.jpg)] w-[90%] bg-no-repeat bg-cover h-96 mt-20 sm:mt-32 rounded-lg">
        <h1 className="text-2xl sm:text-6xl font-bold text-white text-center tracking-wider">
          Jazzee Marketplace
        </h1>
      </div>
      <div className="w-full max-w-[90%] px-4 sm:px-0">
        <div className="flex border-b border-gray-600 mb-4">
          {Object.keys(groupedProducts).map((categoryName, index) => (
            <motion.button
              key={categoryName}
              className={`text-white p-4 border-b-2 w-full ${
                selectedCategory === categoryName
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedCategory(categoryName)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {categoryName}
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderProducts(selectedCategory)}
            <motion.a
              href={`/product/${slug}`}
              className="mt-6 p-3 w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center block"
              whileHover={{ scale: 1.02 }}
            >
              Explore Bidding Options
            </motion.a>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Page;
