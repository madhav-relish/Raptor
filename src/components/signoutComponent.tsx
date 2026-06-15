"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const router = useRouter()
  const handleSignOut = () => {
    try {
      signOut();
      router.push("/signin");
    } catch (error) {
      console.error("Error signing out:", error);

    }
  }
  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
