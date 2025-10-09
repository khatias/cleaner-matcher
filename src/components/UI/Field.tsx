"use client";

import React, {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export type FieldProps = {
  label?: string;
  name: string;
  required?: boolean;
  help?: string;
  error?: string | string[];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  passwordToggle?: boolean;
  textarea?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size">;

export const Field = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FieldProps
>(
  (
    {
      label,
      name,
      required,
      help,
      error,
      leftIcon,
      rightIcon,
      passwordToggle,
      textarea,
      type = "text",
      id,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const fieldId = id ?? `${name}-${autoId}`;
    const descId = `${fieldId}-desc`;

    const [show, setShow] = useState(false);
    const actualType =
      type === "password" && passwordToggle
        ? show
          ? "text"
          : "password"
        : type;

    const errText = Array.isArray(error) ? error.join("\n") : error;
    const hasError = Boolean(errText);

    const baseBox =
      "relative flex items-center rounded-xl border bg-white  transition-colors";
    const borderOk =
      "border-[#d5c28f] focus-within:ring-2 focus-within:ring-[rgba(213,194,143,0.25)]";
    const borderErr =
      "border-red-500 focus-within:ring-2 focus-within:ring-red-200";
    const disabledCls = rest.disabled ? "bg-gray-50 text-gray-400" : "";

    return (
      <div className="grid gap-1.5">
        {label && (
          <label
            htmlFor={fieldId}
            className="text-[0.9rem] font-semibold text-[#1a1a1a]"
          >
            {label}
            {required && <span className="text-red-500"> *</span>}
          </label>
        )}

        <div
          className={`${baseBox} ${
            hasError ? borderErr : borderOk
          } ${disabledCls}`}
        >
          {leftIcon && (
            <span className="inline-flex h-10 items-center justify-center px-2.5 text-[#1a1a1a]">
              {leftIcon}
            </span>
          )}

          {textarea ? (
            <textarea
              id={fieldId}
              name={name}
              aria-invalid={hasError || undefined}
              aria-describedby={help || hasError ? descId : undefined}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className="min-h-24 w-full resize-vertical bg-transparent p-3 text-[0.95rem] text-gray-900 outline-none placeholder:text-gray-400"
              {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              id={fieldId}
              name={name}
              type={actualType}
              aria-invalid={hasError || undefined}
              aria-describedby={help || hasError ? descId : undefined}
              ref={ref as React.Ref<HTMLInputElement>}
              className="h-10 w-full bg-transparent px-3 text-[0.95rem] text-gray-900 outline-none placeholder:text-gray-400"
              {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            />
          )}

          {type === "password" && passwordToggle ? (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="inline-flex h-10 items-center justify-center px-2.5 text-gray-500 hover:text-gray-700"
            >
              {show ? (
                <EyeSlashIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          ) : (
            rightIcon && (
              <span className="inline-flex h-10 items-center justify-center px-2.5 text-[#1a1a1a]">
                {rightIcon}
              </span>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasError ? (
            <p
              id={descId}
              className="whitespace-pre-wrap text-[0.8rem] text-red-500"
            >
              {errText}
            </p>
          ) : help ? (
            <p id={descId} className="text-[0.8rem] text-gray-500">
              {help}
            </p>
          ) : null}
        </div>
      </div>
    );
  }
);
Field.displayName = "Field";
