import apiClient from "@/services/apiClient";
interface VisitorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const getAllVisitor = async (params: VisitorQueryParams) => {
  try {
    const axiosResponse = await apiClient.get("/visitor", {
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

export const getAllVisitorByUser = async (data: any) => {
  try {
    const axiosResponse = await apiClient.post("/user/filter", data);
    const value = axiosResponse.data;
    return value;
  } catch (error: any) {
    return error?.response!.data;
  }
};

export const createVisitor = async (data: any) => {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        formData.append("image", value, value.name);
      } else if (key === "idproof" && value instanceof File) {
        formData.append("idproof", value, value.name);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    const axiosResponse = await apiClient.post(
      "/visitor/create-visitor",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return axiosResponse.data; // Return the API response data
  } catch (error: any) {
    console.error("Error creating visitor:", error);

    // Return the response error or error message if available
    return error?.response?.data || error.message;
  }
};

export const updateVisitor = async (id: string, data: any) => {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        formData.append("image", value, value.name);
      } else if (key === "idproof" && value instanceof File) {
        formData.append("idproof", value, value.name);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    const axiosResponse = await apiClient.put(`/visitor/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return axiosResponse.data; // Return the API response data
  } catch (error: any) {
    console.error("Error creating visitor:", error);

    // Return the response error or error message if available
    return error?.response?.data || error.message;
  }
};

export const deleteVisitor = async (id: string) => {
  try {
    const axiosResponse = await apiClient.delete(`/visitor/${id}`);
    const value = axiosResponse;
    return value;
  } catch (error: any) {
    return error?.response!.data;
  }
};
