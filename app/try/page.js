"use client";
import { useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [postResponse, setPostResponse] = useState(null);
  const [postError, setPostError] = useState(null);
  const [productCount, setProductCount] = useState(null); // State for product count

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
        "Pricing": "USD 25/user/month"
      }
    };

    try {
      const response = await fetch("/api/seller/list-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
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

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/seller/get-master-schema");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      const productCount = data.result ? data.result.length : 0; // Adjusted based on your data structure
      setProductCount(productCount);
      console.log(`Number of products found: ${productCount}`);
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
        onClick={fetchProducts}
        disabled={loading}
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed mb-6"
      >
        {loading ? "Loading..." : "Get Products"}
      </button>
      {error && <p className="text-red-500 mb-6">Error: {error}</p>}

      {productCount !== null && (
        <p className="text-green-500 mb-6">
          Number of products found: {productCount}
        </p>
      )}
    </div>
  );
}
