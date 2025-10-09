// app/(auth)/forgot-password/ForgotPasswordForm.tsx
"use client";

import React from "react";
import { useActionState } from "react";
import type { AuthState } from "@/types/Auth";
import { forgotAction } from "@/app/(auth)/forgot-password/action";
import AuthSubmitButton from "./AuthSubmitButton";
import { Field } from "../UI/Field";
import Link from "next/link";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
const initialState: AuthState = {
  ok: false,
  message: undefined,
  fieldErrors: undefined,
  values: undefined,
};

export default function ForgotPasswordForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(
    forgotAction,
    initialState
  );

  const emailErr = state.fieldErrors?.email?.[0];

  return (
    <div className="w-full">
      <form className="space-y-5" action={formAction} noValidate>
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          leftIcon={<EnvelopeIcon className="h-4 w-4" />}
          required
          aria-invalid={Boolean(emailErr) || undefined}
          aria-describedby={emailErr ? "email-error" : undefined}
          inputMode="email"
          autoComplete="email"
          error={emailErr}
        />

        <div className="flex justify-center">
          <AuthSubmitButton />
        </div>

        {/* Links row */}
        <div className="flex flex-col items-center justify-between gap-3 text-sm mt-3">
          <p className="text-gray-600">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-cocoBlack hover:underline"
            >
              Log in
            </Link>
          </p>
          <p className="text-gray-600">
            New here?{" "}
            <Link
              href="/signup"
              className="font-semibold text-cocoBlack hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </form>

      {!!state.message && (
        <p
          role="status"
          aria-live="polite"
          className={`mt-3 text-sm ${
            state.ok ? "text-green-600" : "text-red-500"
          }`}
        >
          {state.message}
        </p>
      )}

      {/* Legal note */}
      <p className="mt-6 text-[11px] text-gray-500 text-center leading-snug">
        By continuing, you agree to our{" "}
        <Link
          href="/privacy"
          className="text-[#d5c28f] hover:underline font-medium"
        >
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link
          href="/terms"
          className="text-[#d5c28f] hover:underline font-medium"
        >
          Terms of Service
        </Link>
        .
      </p>
    </div>
  );
}
