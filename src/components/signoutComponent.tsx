"use client";

import { signOut } from "next-auth/react";

const SignOutButton = () => {
  return (
    <button
      onClick={() => signOut()}
      className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
