"use client"; // Mark as client component

import { useEffect } from "react";
import { successToast, errorToast , infoToast , warnToast } from "@/components/utils/toastNotification";

type ToastWrapperProps = {
  successMessage?: string;
  errorMessage?: string;
  infoMessage?: string;
  warnMessage?: string;
};

const ToastWrapper = ({ successMessage, errorMessage , infoMessage , warnMessage }: ToastWrapperProps) => {
  useEffect(() => {
    if (successMessage) {
      successToast(successMessage);
    }
    if (errorMessage) {
      errorToast(errorMessage);
    }
    if (infoMessage) {
        infoToast(infoMessage);
    }
    if (warnMessage) {
        warnToast(warnMessage);
    }
  }, [successMessage, errorMessage ,  infoMessage , warnMessage]);

  return null; // This component doesn't render anything
};

export default ToastWrapper;