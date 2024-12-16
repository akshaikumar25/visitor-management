import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as SocietyService from "@/services/societyService";
import { Society, Pagination, TableResponse, GetQueryParams } from "@/types";

export interface SocietyState {
  data: Society[] | null;
  selectedSociety: Society | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: Pagination | null;
}
const initialState: SocietyState = {
  data: null,
  selectedSociety: null,
  status: "idle",
  error: null,
  pagination: null,
};

// Create society
export const createSociety = createAsyncThunk(
  "society/createSociety",
  async (societyData: Society) => {
    const response = await SocietyService.createSocieties(societyData);
    return response.data;
  }
);

// Get all societies with pagination
export const getAllSocieties = createAsyncThunk(
  "society/getAllSocieties",
  async ({ page, limit, search = "" }: GetQueryParams) => {
    const response = await SocietyService.getAllSocieties({
      page,
      limit,
      search,
    });
    return response;
  }
);

export const getSocietyById = createAsyncThunk(
  "society/getSocietyById",
  async (id: number) => {
    const response = await SocietyService.getAllSocietiesById(id);
    return response;
  }
);

// Update society
export const updateSociety = createAsyncThunk(
  "society/updateSociety",
  async ({ id, data }: { id: string; data: Society }) => {
    const response = await SocietyService.updateSocieties(id, data);
    return response;
  }
);

// Delete society
export const deleteSociety = createAsyncThunk(
  "society/deleteSociety",
  async (id: string) => {
    const response = await SocietyService.deleteSocieties(id);
    return { id, ...response };
  }
);

//fetch all societies for dropdown

export const fetchAllSocieties = createAsyncThunk(
  "society/fetchAllSocieties",
  async () => {
    const response = await SocietyService.fetchAllSocieties();
    return response;
  }
);

const societySlice = createSlice({
  name: "society",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create society
    builder
      .addCase(createSociety.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSociety.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createSociety.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to create society";
      });

    // Get all societies
    builder
      .addCase(getAllSocieties.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getAllSocieties.fulfilled,
        (state, action: PayloadAction<TableResponse>) => {
          state.status = "succeeded";
          state.data = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      );
    // Get society by ID
    builder
      .addCase(getSocietyById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSocietyById.fulfilled, (state, action: PayloadAction<{ data: Society; message: string; statusCode: number; success: boolean }>) => {
        state.status = "succeeded";
        state.selectedSociety = action.payload.data;
      })
      .addCase(getSocietyById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch society";
      });

    // Update society
    builder
      .addCase(updateSociety.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSociety.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateSociety.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to update society";
      });

    // Delete society
    builder
      .addCase(deleteSociety.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteSociety.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteSociety.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to delete society";
      });
  },
});

export default societySlice.reducer;
