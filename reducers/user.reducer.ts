import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { signIn } from "next-auth/react";
import apiClient from "@/services/apiClient";
import { User } from "@/types/index";
import axios from "axios";
import * as authService from "@/services/auth";

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

// Request OTP
export const requestOtp = createAsyncThunk(
  "user/requestOtp",
  async (phone: string, thunkAPI) => {
    try {
      const response = await authService.requestOTP({ phone });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "Failed to Send OTP"
        );
      } else if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message || "Failed to Send OTP");
      }
      return thunkAPI.rejectWithValue("Failed to Send OTP");
    }
  }
);

// Login with OTP
export const loginWithCredentials = createAsyncThunk(
  "user/loginWithCredentials",
  async ({ phone, otp }: { phone: string; otp: string }, thunkAPI) => {
    try {
      const response = signIn("credentials", {
        phone,
        otp,
        redirect: true,
      });
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// Fetch single user details
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/users/user/me");
      return { user: response.data, isAuthenticated: true };
    } catch (error: any) {
      if (error.response?.status === 401) {
        return thunkAPI.rejectWithValue({ user: null, isAuthenticated: false });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Request OTP
    builder
      .addCase(requestOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Login with credentials
    builder
      .addCase(loginWithCredentials.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        loginWithCredentials.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          state.token = action.payload.token || null;
          state.isAuthenticated = !!action.payload.token;
          state.error = null;
        }
      )
      .addCase(loginWithCredentials.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Fetch user
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchUser.fulfilled,
        (
          state: UserState,
          action: PayloadAction<{ user: User; isAuthenticated: boolean }>
        ) => {
          state.status = "succeeded";
          state.user = action.payload.user;
          state.isAuthenticated = action.payload.isAuthenticated;
          state.error = null;
        }
      )
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
