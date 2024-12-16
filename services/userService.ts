import { GetQueryParams, User } from "@/types";
import apiClient from "./apiClient";

export const createUser = async (userData: any) => {
  try {
    const response = await apiClient.post("/users/create-user", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async (params: GetQueryParams) => {
  try {
    const response = await apiClient.get("/users", {
      params: {
        page: params.page,
        limit: params.limit,
        searchTerm: params.search || "",
      },
    });
    return response.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const updateUser = async (id: string, userData: User) => {
  try {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await apiClient.delete(`users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const userfilter = async (userData: any) => {
  try {
    const response = await apiClient.post(`users/filter`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
