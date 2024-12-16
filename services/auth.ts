import apiClient from "./apiClient";

export const requestOTP = async (credentials: any) => {
  const response = await apiClient.post("auth/request-otp", credentials);
  return response;
};

export const verifyOTP = async ({
  phone,
  otp,
}: {
  phone: string;
  otp: string;
}) => {
  const response = await apiClient.post("auth/verify-otp", { phone, otp });
  return response;
};
