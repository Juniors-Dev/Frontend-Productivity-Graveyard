export function validateUsername(username) {
  if (!username) return { isValid: false, message: "Username is required" };
  if (username.length < 3)
    return {
      isValid: false,
      message: "Username must be at least 3 characters",
    };
  if (username.length > 30)
    return { isValid: false, message: "Username cannot exceed 30 characters" };
  if (!/^[a-zA-Z0-9æøåÆØÅ_-]+$/.test(username))
    return {
      isValid: false,
      message:
        "Username can only contain letters, numbers, underscores and hyphens",
    };
  return { isValid: true, message: "" };
}

export function validateEmail(email) {
  if (!email) return { isValid: false, message: "Email is required" };
  if (
    !/^[a-zA-Z0-9æøåÆØÅ._%+-]+@[a-zA-Z0-9æøåÆØÅ.-]+\.[a-zA-ZæøåÆØÅ]{2,}$/.test(
      email,
    )
  )
    return { isValid: false, message: "Please enter a valid email address" };
  return { isValid: true, message: "" };
}

export function validatePassword(password) {
  if (!password) return { isValid: false, message: "Password is required" };
  if (password.length < 8)
    return {
      isValid: false,
      message: "Password must be at least 8 characters",
    };
  const missing = [];
  if (!/[A-ZÆØÅ]/.test(password))
    missing.push("an uppercase letter (A-Z, ÆØÅ)");
  if (!/[a-zæøå]/.test(password)) missing.push("a lowercase letter (a-z, æøå)");
  if (!/[0-9]/.test(password)) missing.push("a number");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    missing.push("a special character");
  if (missing.length > 0)
    return {
      isValid: false,
      message: `Password must include ${missing.join(", ")}`,
    };
  return { isValid: true, message: "" };
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword)
    return { isValid: false, message: "Please confirm your password" };
  if (password !== confirmPassword)
    return { isValid: false, message: "Passwords do not match" };
  return { isValid: true, message: "" };
}

export function validateTerms(checked) {
  if (!checked)
    return {
      isValid: false,
      message: "You must accept the terms and conditions",
    };
  return { isValid: true, message: "" };
}
