import http from "@/http";

export const login = async (body) => {
  const response = await http.post("auth/login", body);
  return response.data;
};
