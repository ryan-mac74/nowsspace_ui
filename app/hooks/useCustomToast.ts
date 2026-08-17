"use client";

import { toast } from "sonner";

export default function useCustomToast() {
  const showSuccessToast = (message: string) => {
    toast.success(message);
  };

  const showErrorToast = (message: string) => {
    toast.error(message);
  };

  return { showSuccessToast, showErrorToast };
}
