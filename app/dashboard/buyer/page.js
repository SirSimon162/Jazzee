"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import useProductStore from "@/store/product-store";
import useAuthStore from "@/store/user-store";

const BuyerDashboard = () => {
  const { userInfo } = useAuthStore((state) => ({
    userInfo: state.userInfo,
  }));

  const { requestedOrders, confirmedOrders, confirmOrder } = useProductStore(
    (state) => ({
      requestedOrders: state.requestedOrders,
      confirmedOrders: state.confirmedOrders,
      confirmOrder: state.confirmOrder,
    })
  );

  useEffect(() => {
    console.log("Requested Orders:", requestedOrders);
  }, [requestedOrders]);

  const [confirmingOrder, setConfirmingOrder] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");

  const handleConfirmOrder = (productId) => {
    setConfirmingOrder(productId);
  };

  const handleVerifyOtp = () => {
    if (otp === "123456") {
      setOtpVerified(true);
      confirmOrder(confirmingOrder);
      setTimeout(() => {
        setConfirmingOrder(null);
        setOtpVerified(false);
        setOtp("");
      }, 3000);
    }
  };

  const renderProviderDetails = (product) => {
    return product.providers.map((provider) => (
      <div key={provider.name} className="mb-2">
        <p>{provider.name}</p>
        <p>{provider.price}</p>
      </div>
    ));
  };

  const renderOrderCard = (product, isConfirmed) => {
    const lowestPriceProvider = product.providers.reduce((lowest, current) =>
      parseFloat(current.price.replace("$", "")) <
      parseFloat(lowest.price.replace("$", ""))
        ? current
        : lowest
    );

    return (
      <motion.div
        key={product.id}
        className="p-6 bg-gray-800 rounded-lg shadow-lg mb-4 border border-[#0e0e10] hover:border-blue-500 hover:shadow-sm hover:shadow-blue-500"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <h3 className="text-2xl font-semibold mb-4">{product.name}</h3>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-8">
          {renderProviderDetails(product)}
        </div>
        <p className="text-lg font-semibold text-yellow-400 mt-4">
          Entered Price: {product.quoteDetails.initialPrice}
        </p>
        <p className="text-lg font-semibold text-green-400 mt-2">
          Lowest Quote: {lowestPriceProvider.price} by{" "}
          {lowestPriceProvider.name}
        </p>

        {!isConfirmed && (
          <motion.button
            onClick={() => handleConfirmOrder(product.id)}
            className="p-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            Confirm Order
          </motion.button>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen w-full pt-32 pb-20 px-6 bg-gray-900 text-white bg-[radial-gradient(circle_900px_at_50%_600px,#6533ee78,transparent)]">
      <motion.h1
        className="text-4xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Your Organization: {userInfo.name}!
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-semibold mb-4">Requested Quotes</h2>
          <div className="flex-1 overflow-y-auto">
            {requestedOrders.length === 0 && <p>No requested quotes.</p>}
            {requestedOrders.map((product) => renderOrderCard(product, false))}
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-semibold mb-4">Confirmed Orders</h2>
          <div className="flex-1 overflow-y-auto">
            {confirmedOrders.length === 0 && <p>No confirmed orders.</p>}
            {confirmedOrders.map((product) => renderOrderCard(product, true))}
          </div>
        </motion.div>
      </div>

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
              className="bg-black p-6 rounded-lg shadow-lg w-full max-w-lg flex flex-col items-center text-white text-center"
            >
              {!otpVerified ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Verify OTP to Confirm Order
                  </h2>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full p-2 mb-4 border border-x-0 border-t-0 border-b-1 bg-transparent border-blue-500 focus:outline-none"
                  />
                  <motion.button
                    onClick={handleVerifyOtp}
                    className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    Verify OTP
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <AiOutlineCheckCircle size={60} className="text-green-500" />
                  <p className="mt-4 text-xl font-semibold">
                    Order Confirmed! Check your email for details.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuyerDashboard;
