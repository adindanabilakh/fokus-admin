export const isAuthenticated = () => {
    return typeof window !== "undefined" && localStorage.getItem("token");
  };
  