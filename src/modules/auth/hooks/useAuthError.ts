"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import {
  getAuthErrorMessage,
  getErrorType,
} from "../../../errors/errorMapping";

export function useAuthError() {
  const handleError = useCallback((error: unknown, context?: string) => {
    let errorMessage: string;
    let errorType: "error" | "warning" | "info" = "error";

    if (error instanceof Error) {
      errorMessage = getAuthErrorMessage(error);
      errorType = getErrorType(error);
    } else if (typeof error === "string") {
      errorMessage = getAuthErrorMessage(error);
      errorType = getErrorType(error);
    } else {
      errorMessage = "An unexpected error occurred";
    }

    const finalMessage = context ? `${context}: ${errorMessage}` : errorMessage;

    switch (errorType) {
      case "warning":
        toast.warning(finalMessage, {
          duration: 5000,
          description: "Please try again in a few moments",
        });
        break;
      case "info":
        toast.info(finalMessage, {
          duration: 6000,
          description: "Check your email for more instructions",
        });
        break;
      default:
        toast.error(finalMessage, {
          duration: 4000,
          description: "Please verify your data and try again",
        });
    }

    console.error("Auth Error:", {
      originalError: error,
      mappedMessage: errorMessage,
      context,
      timestamp: new Date().toISOString(),
    });

    return errorMessage;
  }, []);

  const handleSuccess = useCallback((message: string, description?: string) => {
    toast.success(message, {
      duration: 3000,
      description,
    });
  }, []);

  return {
    handleError,
    handleSuccess,
  };
}
