import { API } from "@/api/axios";
import { ApiResponse, User } from "@/types";

export interface UpdateUserPayload {
  username?: string;
  fullname?: string;
}

export async function updateUser(
  userId: string,
  data: UpdateUserPayload,
): Promise<ApiResponse<{ user: User }>> {
  const res = await API.patch(`/user/${userId}`, data);
  return res.data;
}

export async function updateProfilePicture(
  formData: FormData,
): Promise<ApiResponse<{ user: User }>> {
  const res = await API.post(`/user/profile-picture`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function toggleTwoFactorAuth(): Promise<ApiResponse<{ twoFactorEnabled: boolean }>> {
  const res = await API.post(`/user/toggle-2fa`);
  return res.data;
}