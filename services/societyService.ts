import apiClient from "@/services/apiClient";

interface SocietyQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const getAllSocieties = async (params: SocietyQueryParams) => {
  try {
    const axiosResponse = await apiClient.get("/societies",{
      params: {
        page: params.page,
        limit: params.limit,
        searchTerm: params.search || "",
      },
    });
    return axiosResponse.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const getAllSocietiesByUser = async (data: any) => {
  try {
    const axiosResponse = await apiClient.post("/user/filter", data);
    const value = axiosResponse.data;
    return value;
  } catch (error: any) {
    return error?.response!.data;
  }
};
export const createSocieties = async (data: any) => {
  try {
    const axiosResponse = await apiClient.post(
      "/societies/create-society",
      data
    );
    return axiosResponse;
  } catch (error: any) {
    return error?.response!.data;
  }
};
export const updateSocieties = async (id: string, data: any) => {
  try {
    const axiosResponse = await apiClient.put(`/societies/${id}`, data);
    const value = axiosResponse;
    return value;
  } catch (error: any) {
    return error?.response!.data;
  }
};
export const deleteSocieties = async (id: string) => {
  try {
    const axiosResponse = await apiClient.delete(`/societies/${id}`);
    const value = axiosResponse.data;
    return value;
  } catch (error: any) {
    return error?.response!.data;
  }
};


export const fetchAllSocieties = async () => {
  try {
    const axiosResponse = await apiClient.get("/societies/all-society");

    return axiosResponse.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const getAllSocietiesById = async (id: number) => {
  try {
    const axiosResponse = await apiClient.get(`/societies/${id}`);
    const value = axiosResponse.data;
    return value;
  } catch (error: any) {
    return error?.response!.data;
  }
};

