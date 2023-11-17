export function keepConnected(to, from, next) {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    next({ name: "Home" });
  } else {
    next();
  }
}
