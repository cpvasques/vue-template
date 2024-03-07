export const handleBearerConfig = (config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

export const handleBearerError = (error) => {
  return Promise.reject(error);
};
