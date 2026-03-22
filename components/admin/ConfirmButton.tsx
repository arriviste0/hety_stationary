"use client";

import type { ButtonHTMLAttributes } from "react";

type ConfirmButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  message?: string;
};

export default function ConfirmButton({
  message = "Are you sure you want to proceed?",
  onClick,
  ...props
}: ConfirmButtonProps) {
  return (
    <button
      {...props}
      onClick={(event) => {
        if (!confirm(message)) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
    />
  );
}
