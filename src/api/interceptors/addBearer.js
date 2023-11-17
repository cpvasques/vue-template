export const addBearer = (config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

export const addBearerError = (error) => {
  return Promise.reject(error);
};
