"use client";
import { useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [postResponse, setPostResponse] = useState(null);
  const [postError, setPostError] = useState(null);
  const [openBids, setOpenBids] = useState(null); // State for storing open bids

  const listProduct = async () => {
    setLoading(true);
    setPostError(null);

    const payload = {
      product: {
        sellerCustomName: "Atlassian",
        categorySlug: "code-collaboration",
        categoryName: "Code Collaboration Platforms",
        productName: "Bitbucket",
        "Issue Tracking": "JIRA Integrated",
        "CI/CD Option": "Jenkins, CircleCI",
        "Pricing": "USD 25/user/month",
      },
    };

    try {
      const response = await fetch("/api/seller/list-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to list product");
      }
      const data = await response.json();
      setPostResponse(data);
    } catch (err) {
      setPostError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const placeBid = async () => {
    setLoading(true);
    setError(null);

    const randomData = {
      _id: "66d4360df196191e96b2842b", // Replace with actual order ID
      price: Math.floor(Math.random() * 1000) + 100, // Random price between 100 and 1100
      productName: "Random Product",
    };

    try {
      const response = await fetch("/api/buyer/update-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(randomData),
      });
      if (!response.ok) {
        throw new Error("Failed to place bid");
      }
      const data = await response.json();
      setPostResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOpenBids = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/buyer/get-order-bids");
      if (!response.ok) {
        throw new Error("Failed to fetch open bids");
      }
      const data = await response.json();
      setOpenBids(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
      
      <button
        onClick={listProduct}
        disabled={loading}
        className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed mb-6"
      >
        {loading ? "Loading..." : "Add Product"}
      </button>
      {postError && <p className="text-red-500 mb-6">Error: {postError}</p>}
      {postResponse && (
        <pre className="p-4 bg-white rounded-md shadow-md whitespace-pre-wrap">
          {JSON.stringify(postResponse, null, 2)}
        </pre>
      )}

      <button
        onClick={placeBid}
        disabled={loading}
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed mb-6"
      >
        {loading ? "Loading..." : "Place Bid"}
      </button>
      {error && <p className="text-red-500 mb-6">Error: {error}</p>}

      <button
        onClick={fetchOpenBids}
        disabled={loading}
        className="px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed mb-6"
      >
        {loading ? "Loading..." : "Get Open Bids"}
      </button>
      {openBids && (
        <pre className="p-4 bg-white rounded-md shadow-md whitespace-pre-wrap">
          {JSON.stringify(openBids, null, 2)}
        </pre>
      )}
    </div>
  );
}
