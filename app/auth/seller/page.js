"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "../../../store/user-store";
import Link from "next/link";

export default function SellerAuthPage() {
  const { setSession, clearSession, saveUserInfo } = useAuthStore();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleAuthentication = async () => {
      if (session) {
        setSession(session);

        try {
          const response = await fetch("/api/user-login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: session.user.name,
              role: "seller",
            }),
          });

          const result = await response.json();
          console.log(result);

          if (result.code === "cname") {
            router.push("/cname");
          } else {
            router.push("/dashboard/seller");
          }
        } catch (error) {
          console.error("Error during authentication:", error);
        }
      }
    };

    handleAuthentication();
  }, [session, setSession, saveUserInfo, router]);

  const handleSignIn = () => {
    signIn("google");
  };

  const handleSignOut = () => {
    signOut();
    clearSession();
  };

  return (
    <div className="flex h-screen bg-black w-full bg-[radial-gradient(circle_500px_at_50%_300px,#6533ee78,transparent)]">
      <div className="m-auto max-w-md w-full px-8 py-6 bg-white bg-opacity-10 backdrop-blur-xl rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">
            {session ? "Welcome Back!" : "LIST YOUR PRODUCT"}
          </h1>
          <p className="text-gray-200 mb-4">
            {session
              ? `Signed in as ${session.user.email}`
              : "Sign in to continue as a Seller"}
          </p>

          {session ? (
            <button
              onClick={handleSignOut}
              className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              Sign in with Google
            </button>
          )}

          <div className="mt-4 text-sm text-gray-200">
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            &nbsp;|&nbsp;
            <Link href="/terms-of-service" className="hover:underline">
              Terms of Service
            </Link>
          </div>

          <div className="mt-4 text-sm text-gray-200">
            Want to sign in as a Buyer?{" "}
            <Link
              href="/auth/buyer"
              className="hover:underline text-blue-200 underline"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
