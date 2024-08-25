"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "../../../store/user-store";

export default function SellerAuthPage() {
  const { session, setSession, clearSession, saveUserInfo } = useAuthStore();
  const { data: nextAuthSession } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (nextAuthSession) {
      setSession(nextAuthSession);
      saveUserInfo(nextAuthSession.user.name, "seller");
      router.push("/");
    }
  }, [nextAuthSession, setSession, saveUserInfo, router]);

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
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
            <a href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </a>
            &nbsp;|&nbsp;
            <a href="/terms-of-service" className="hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
