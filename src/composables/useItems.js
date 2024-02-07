import { useQuery, useMutation } from "@tanstack/vue-query";
import { itemService } from "@/services/itemService";

export function useItems() {
  // useQuery não suporta diretamente onSuccess e onError.
  return useQuery(["items"], itemService.getAll);
}

export function useItemById(id) {
  // useQuery não suporta diretamente onSuccess e onError.
  return useQuery(["item", id], () => itemService.getById(id));
}

export function useCreateItem() {
  return useMutation({
    mutationFn: itemService.create,
    onSuccess: (data) => {
      console.log("Sucesso ao criar item", data);
    },
    onError: (error) => {
      console.log("Erro ao criar item", error);
    },
  });
}

export function usePatchItem() {
  return useMutation({
    mutationFn: ({ id, data }) => itemService.patch(id, data),
    onSuccess: (data) => {
      console.log("Sucesso ao atualizar item", data);
    },
    onError: (error) => {
      console.log("Erro ao atualizar item", error);
    },
  });
}

export function usePutItem() {
  return useMutation({
    mutationFn: ({ id, data }) => itemService.put(id, data),
    onSuccess: (data) => {
      console.log("Sucesso ao atualizar item", data);
    },
    onError: (error) => {
      console.log("Erro ao atualizar item", error);
    },
  });
}

export function useDeleteItem() {
  return useMutation({
    mutationFn: (id) => itemService.delete(id),
    onSuccess: (data) => {
      console.log("Sucesso ao deletar item", data);
    },
    onError: (error) => {
      console.log("Erro ao deletar item", error);
    },
  });
}
