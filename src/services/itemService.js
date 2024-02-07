import http from "@/http";

const baseURL = "/items"; // Endpoint base

export const itemService = {
  // Ler todos os itens
  getAll: async () => {
    const response = await http.get(baseURL);
    return response.data;
  },

  // Ler um item pelo ID
  getById: async (id) => {
    const response = await http.get(`${baseURL}/${id}`);
    return response.data;
  },

  // Criar um novo item
  create: async (itemData) => {
    const response = await http.post(baseURL, itemData);
    return response.data;
  },

  // Atualizar um item pelo ID (PATCH)
  patch: async (id, itemData) => {
    const response = await http.patch(`${baseURL}/${id}`, itemData);
    return response.data;
  },

  // Atualizar um item pelo ID (PUT)
  put: async (id, itemData) => {
    const response = await http.put(`${baseURL}/${id}`, itemData);
    return response.data;
  },

  // Deletar um item pelo ID
  delete: async (id) => {
    const response = await http.delete(`${baseURL}/${id}`);
    return response.data;
  },
};
