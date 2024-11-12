// Helper function to get a specific cookie value by name
export const getCookieValue = (name) => {
  if (typeof document !== "undefined") {
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];
    return value ? decodeURIComponent(value) : null;
  }
  return null;
};

// Updated isAuthenticated function using the helper
export const isAuthenticated = () => {
  const cookieValue = getCookieValue("access_token");
  console.log("cookieValue",cookieValue)
  return !!cookieValue; 
};
