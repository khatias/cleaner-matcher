"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/(auth)/login/action";
import type { AuthState } from "@/types/Auth";
import AuthSubmitButton from "./AuthSubmitButton";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { Field } from "../UI/Field";
import Link from "next/link";

const initialState: AuthState = {
  ok: false,
  message: undefined,
  fieldErrors: undefined,
  values: undefined,
};

export default function LoginForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(
    loginAction,
    initialState
  );

  const emailErr = state.fieldErrors?.email?.[0];
  const passErr = state.fieldErrors?.password?.[0];

  return (
    <div className="w-full">
      <form className="space-y-5" action={formAction} noValidate>
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          defaultValue={state.values?.email ?? ""}
          leftIcon={<EnvelopeIcon className="h-4 w-4" />}
          error={emailErr}
          aria-invalid={Boolean(emailErr) || undefined}
          aria-describedby={emailErr ? "email-error" : undefined}
          autoComplete="email"
          id="email"
        />

        <div className="space-y-2">
          <Field
            label="Password"
            name="password"
            type="password"
            passwordToggle
            placeholder="Your password"
            required
            leftIcon={<LockClosedIcon className="h-4 w-4" />}
            error={passErr}
            aria-invalid={Boolean(passErr) || undefined}
            aria-describedby={passErr ? "password-error" : undefined}
            autoComplete="current-password"
            id="password"
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-cocoBlack hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="pt-1 flex justify-center">
          <AuthSubmitButton />
        </div>

        <div className="flex items-center justify-center text-sm text-gray-700">
          <p>
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-cocoBlack hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>

      {!!state.message && (
        <p
          role="status"
          className={`mt-3 text-sm ${
            state.ok ? "text-green-600" : "text-red-500"
          }`}
        >
          {state.message}
        </p>
      )}

      <p className="mt-6 text-[11px] text-gray-500 text-center leading-snug">
        By logging in, you agree to our{" "}
        <Link
          href="/privacy"
          className="text-sandDark hover:underline font-medium"
        >
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link
          href="/terms"
          className="text-sandDark hover:underline font-medium"
        >
          Terms of Service
        </Link>
        .
      </p>
    </div>
  );
}
