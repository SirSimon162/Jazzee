// pages/login.js or pages/signup.js
"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthPage() {
  const { data: session } = useSession();

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="m-auto max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            {session ? "Welcome!" : "Join Us!"}
          </h1>
          <p className="text-gray-600 mb-8">
            {session
              ? `Signed in as ${session.user.email}`
              : "Sign in to continue"}
          </p>

          {session ? (
            <button
              onClick={() => signOut()}
              className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              Sign in with Google
            </button>
          )}

          <div className="mt-4 text-sm text-gray-500">
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
