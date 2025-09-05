// Supabase error mapping to user-friendly English messages
export const authErrorMessages: Record<string, string> = {
  // Validation errors
  "Invalid email": "Invalid email format",
  "Password should be at least 6 characters":
    "Password must be at least 6 characters",
  "Invalid login credentials": "Invalid credentials",
  "Email not confirmed": "Please confirm your email before signing in",

  // Registration errors
  "User already registered": "This email is already registered",
  "Signup requires a valid password":
    "A valid password is required for registration",
  "Unable to validate email address: invalid format": "Invalid email format",

  // Authentication errors
  "Invalid token": "Invalid authentication token",
  "Token has expired": "Your session has expired, please sign in again",
  "Invalid refresh token": "Invalid refresh token",
  "Email rate limit exceeded": "Too many emails sent. Please try again later",

  // Generic credential errors - all map to "Invalid credentials"
  "Invalid username or password": "Invalid credentials",
  "Incorrect password": "Invalid credentials",
  "User not found": "Invalid credentials",
  "Authentication failed": "Invalid credentials",
  "Login failed": "Invalid credentials",
  "Sign in failed": "Invalid credentials",
  "Access denied": "Invalid credentials",
  "Invalid user": "Invalid credentials",
  "Bad credentials": "Invalid credentials",
  "Wrong password": "Invalid credentials",
  "Invalid password": "Invalid credentials",
  "Invalid email or password": "Invalid credentials",
  "Email or password incorrect": "Invalid credentials",
  "Username or password incorrect": "Invalid credentials",

  // Network/connection errors
  "Network request failed": "Connection error. Please check your internet",
  "Request timeout": "Request timed out. Please try again",
  "Service unavailable": "Service temporarily unavailable",

  // Server errors
  "Internal Server Error": "Internal server error. Please try again later",
  "Invalid payload": "Invalid data sent",

  // Supabase specific errors
  signup_disabled: "Registration is temporarily disabled",
  email_address_invalid: "Invalid email format",
  password_too_short: "Password is too short",
  weak_password: "Password is too weak",
  user_not_found: "Invalid credentials",
  wrong_password: "Invalid credentials",
  too_many_requests:
    "Too many attempts. Please wait a moment before trying again",
  email_not_confirmed: "Please confirm your email before continuing",
  invalid_credentials: "Invalid credentials",
  account_not_found: "Invalid credentials",
  invalid_email: "Invalid email",
  email_already_exists: "This email is already in use",
  password_mismatch: "Passwords do not match",
  session_not_found: "Session not found",
  invalid_request: "Invalid request",
  unauthorized: "Invalid credentials",
  forbidden: "Access denied",
  not_found: "Resource not found",
  conflict: "Data conflict",
  unprocessable_entity: "Unprocessable data",
  rate_limit_exceeded: "Rate limit exceeded",
  server_error: "Server error",
  bad_gateway: "Bad gateway error",
  service_unavailable: "Service unavailable",
  gateway_timeout: "Gateway timeout",

  // Form validation errors
  required: "This field is required",
  email: "Must be a valid email",
  min: "Value is too short",
  max: "Value is too long",
  pattern: "Invalid format",

  // Network and connection errors
  "Network Error": "Connection error. Please check your internet",
  "timeout of 60000ms exceeded": "Request timed out. Please try again",
  ERR_NETWORK: "Network error. Please check your connection",
  ERR_INTERNET_DISCONNECTED: "No internet connection",
  ERR_CONNECTION_REFUSED: "Connection refused by server",
  ERR_CONNECTION_TIMED_OUT: "Connection timed out",

  // HTTP specific errors
  "400": "Bad request",
  "401": "Unauthorized",
  "403": "Access denied",
  "404": "Not found",
  "409": "Data conflict",
  "422": "Unprocessable data",
  "429": "Too many requests",
  "500": "Internal server error",
  "502": "Bad gateway",
  "503": "Service unavailable",
  "504": "Gateway timeout",
};

// Function to get user-friendly error message
export function getAuthErrorMessage(error: string | Error): string {
  const errorMessage = typeof error === "string" ? error : error.message;

  // Look for exact match first
  if (authErrorMessages[errorMessage]) {
    return authErrorMessages[errorMessage];
  }

  // Look for partial matches (case insensitive)
  const lowerErrorMessage = errorMessage.toLowerCase();
  for (const [key, value] of Object.entries(authErrorMessages)) {
    if (lowerErrorMessage.includes(key.toLowerCase())) {
      return value;
    }
  }

  // If no match found, return original message
  return errorMessage || "An unexpected error occurred";
}

// Function to determine error type
export function getErrorType(
  error: string | Error
): "error" | "warning" | "info" {
  const errorMessage = typeof error === "string" ? error : error.message;
  const lowerErrorMessage = errorMessage.toLowerCase();

  if (
    lowerErrorMessage.includes("rate limit") ||
    lowerErrorMessage.includes("too many requests") ||
    lowerErrorMessage.includes("timeout")
  ) {
    return "warning";
  }

  if (
    lowerErrorMessage.includes("email not confirmed") ||
    lowerErrorMessage.includes("confirmation")
  ) {
    return "info";
  }

  return "error";
}
