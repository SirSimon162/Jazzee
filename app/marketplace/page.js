"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import useProductStore from "@/store/product-store";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);

  const { products, setSelectedProduct } = useProductStore((state) => ({
    products: state.products,
    setSelectedProduct: state.setSelectedProduct,
  }));

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-start w-full bg-black bg-[radial-gradient(circle_900px_at_50%_300px,#6533ee78,transparent)] pb-20">
      <div className="flex flex-col gap-4 sm:gap-8 p-4 justify-center items-center mb-6 bg-[url(https://res.cloudinary.com/darx97f61/image/upload/v1724614437/bg-blur_kafhg5.jpg)] w-[90%] bg-no-repeat bg-cover h-96 mt-20 sm:mt-32  rounded-lg">
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
            key={product.id}
            layoutId={product.id}
            onClick={() => setSelectedProduct(product)}
            whileHover={{ scale: 1.01 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 cursor-pointer mb-4 p-4 rounded-lg hover:shadow-sm transition-shadow duration-200 bg-[#0e0e10] w-full max-w-[90%] mx-auto border border-1 border-[#0e0e10] hover:border-blue-500 shadow-blue-400 hover:shadow-blue-500"
          >
            <div className="flex flex-col">
              <motion.h2 className="text-2xl font-bold mb-1 text-white tracking-wide">
                {product.name}
              </motion.h2>
              <p className="text-gray-200 mb-4">{product.description}</p>
              <motion.button
                onClick={() => setSelectedProductId(product.id)}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 transition-colors px-7 max-w-[150px]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore
              </motion.button>
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-4 sm:mb-0">
              {product.providers.map((provider, index) => (
                <div key={index} className="flex-1">
                  <h5 className="text-gray-300 font-semibold">
                    {provider.name}
                  </h5>
                  <p className="text-sm text-gray-300">{provider.price}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

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
                  .filter((product) => product.id === selectedProductId)
                  .map((product) => (
                    <div key={product.id}>
                      <div className="flex justify-between items-center mb-4">
                        <motion.h2 className="text-2xl font-bold text-white text-center">
                          {product.name}
                        </motion.h2>
                        <motion.button
                          onClick={() => setSelectedProductId(null)}
                          className="flex items-center justify-center w-8 h-8 rounded-full text-blue-500 transition-colors"
                          whileHover={{ scale: 1.2, rotate: 90 }}
                        >
                          <AiOutlineClose size={20} />
                        </motion.button>
                      </div>
                      {product.providers.map((provider, index) => (
                        <motion.div
                          key={index}
                          className="mb-4 p-4 border border-[#0e0e10] hover:border-blue-500 rounded-md"
                          initial={{ opacity: 0, x: 100 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.4 }}
                        >
                          <motion.h5 className="text-xl font-semibold text-gray-200">
                            {provider.name}
                          </motion.h5>
                          <motion.p className="text-gray-300">
                            Price: {provider.price}
                          </motion.p>
                          <motion.p className="text-gray-400">
                            Features: {provider.features}
                          </motion.p>
                          <motion.p className="text-gray-400">
                            Storage: {provider.gigs}
                          </motion.p>
                          <motion.p className="text-gray-400">
                            Concurrency: {provider.concurrency}
                          </motion.p>
                        </motion.div>
                      ))}
                      <motion.a
                        href={`/product/${product.id}`}
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
