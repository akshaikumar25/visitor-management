import { ApartmentInfo, GetQueryParams } from "@/types";
import apiClient from "./apiClient";

export const createApartment = async (apartmentData: ApartmentInfo) => {
  try {
    const response = await apiClient.post(
      "/apartments/create-apartment",
      apartmentData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllApartments = async (params: GetQueryParams) => {
  try {
    const response = await apiClient.get("/apartments", {
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
export const updateApartment = async (
  id: string,
  apartmentData: ApartmentInfo
) => {
  try {
    const response = await apiClient.put(`/apartments/${id}`, apartmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteApartment = async (id: string) => {
  try {
    const response = await apiClient.delete(`/apartments/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
