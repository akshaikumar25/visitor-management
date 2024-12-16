import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, Pagination, TableResponseUser, GetQueryParams } from "@/types";
import * as UserService from "@/services/userService";

export interface AllUsers {
  users: User[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: Pagination | null;
}
const initialState: AllUsers = {
  users: [],
  status: "idle",
  error: null,
  pagination: null,
};
// Fetch all users
export const fetchAllUser = createAsyncThunk(
  "user/fetchAllUser",
  async ({ page, limit, search = "" }: GetQueryParams) => {
    const response = await UserService.getAllUsers({
      page,
      limit,
      search,
    });
    return response;
  }
);

// Create new user
export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData: User, thunkAPI) => {
    try {
      if (userData.currentSocietyId) {
        userData.currentSocietyId = Number(userData.currentSocietyId);
        userData.societyId = Number(userData.currentSocietyId);
        userData.apartmentId = Number(userData.apartmentId);
      }
      const response = await UserService.createUser(userData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create user"
      );
    }
  }
);

// Update user by ID
export const updateUserById = createAsyncThunk(
  "user/updateUserById",
  async ({ id, data }: { id: string; data: User }, thunkAPI) => {
    try {
      if (data.currentSocietyId) {
        data.currentSocietyId = Number(data.currentSocietyId);
        data.societyId = Number(data.currentSocietyId);
        data.apartmentId = Number(data.apartmentId);
      }
      const response = await UserService.updateUser(id, data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update user"
      );
    }
  }
);

// Delete user by ID
export const deleteUserById = createAsyncThunk(
  "user/deleteUserById",
  async (id: string, thunkAPI) => {
    try {
      await UserService.deleteUser(id);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    // Get all users
    builder
      .addCase(fetchAllUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAllUser.fulfilled,
        (state, action: PayloadAction<TableResponseUser>) => {
          state.status = "succeeded";
          state.users = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchAllUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch users";
      })

      // Create User
      .addCase(createUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.users?.push(action.payload);
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Update User
      .addCase(updateUserById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        updateUserById.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.status = "succeeded";
          if (state.users) {
            const index = state.users.findIndex(
              (user) => user.id === action.payload.id
            );
            // Ensure index is valid
            if (index !== -1) {
              state.users[index] = { ...state.users[index], ...action.payload };
            }
          }
          state.error = null;
        }
      )
      .addCase(updateUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Delete User
      .addCase(deleteUserById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        deleteUserById.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.users = state.users
            ? state.users.filter((user) => user.id !== action.payload)
            : null;

          state.error = null;
        }
      )
      .addCase(deleteUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
