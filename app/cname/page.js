"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import useAuthStore from "@/store/user-store";

export default function CustomNamePage() {
  const { data: session, status } = useSession();
  const { saveUserInfo, userInfo } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/user-details");
        if (response.ok) {
          const user = await response.json();
          if (user.customName) {
            saveUserInfo(user.customName, userInfo.role);
            router.push(`/dashboard/${userInfo.role}`);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUserDetails();
  }, [status]);

  const handleCustomNameSubmit = async (e) => {
    e.preventDefault();
    const customName = e.target.elements.customName.value;

    try {
      const response = await fetch("/api/user-cname", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          customName: customName,
        }),
      });

      if (response.ok) {
        saveUserInfo(customName, "buyer");
        console.log(userInfo);
        router.push("/dashboard/buyer");
      } else {
        console.error("Failed to update custom name:", response.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  console.log(session);

  return (
    <div className="flex h-screen bg-black w-full bg-[radial-gradient(circle_500px_at_50%_300px,#6533ee78,transparent)]">
      <div className="m-auto max-w-md w-full px-8 py-6 bg-white bg-opacity-10 backdrop-blur-xl rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Enter Company Name</h1>
          <form onSubmit={handleCustomNameSubmit} className="mt-4">
            <input
              type="text"
              name="customName"
              placeholder="Company Name"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              required
            />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
