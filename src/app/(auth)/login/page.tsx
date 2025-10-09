import LoginForm from "@/components/auth/LoginForm";
import React from "react";

export default function Page() {
  return (
    <div className="min-h-screen bg-custombg overflow-hidden">
      <div className="container mx-auto min-h-screen px-6 md:px-10 lg:px-16 xl:px-24 flex items-center justify-center">
        <div className="w-full max-w-[450px] rounded-xl  bg-white/80 backdrop-blur p-7 shadow-sm">
          <div className="mb-6">
            <h1 className="text-cocoBlack text-2xl font-semibold">
              Login
            </h1>
            <div className="mt-2 h-[3px] w-10 rounded bg-sandDark" />
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
