import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as ApartmentService from "@/services/apartmentService";
import { ApartmentInfo, Pagination, GetQueryParams } from "@/types";

export interface apartments {
  data: ApartmentInfo[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: Pagination | null;
}

const initialState: apartments = {
  data: [],
  status: "idle",
  error: null,
  pagination: null,
};

// Fetch all apartment
export const fetchAllApartment = createAsyncThunk(
  "apartment/fetchAllApartment",
  async ({ page, limit, search = "" }: GetQueryParams) => {
    const response = await ApartmentService.getAllApartments({
      page,
      limit,
      search,
    });

    return {
      data: response.data.map((apartment: ApartmentInfo) => ({
        id: apartment.id,
        name: apartment.name,
        users: apartment.owner?.name || "N/A",
        userId: apartment.owner?.id || "N/A",
        society: apartment.society?.name || "N/A",
        societyId: apartment.society?.id || "N/A",
      })),
      pagination: {
        total: response.pagination.total,
        page: response.pagination.page,
        limit: response.pagination.limit,
        totalPages: response.pagination.totalPages,
      },
    };
  }
);

// Create new apartments
export const createApartment = createAsyncThunk(
  "apartment/createApartment",
  async (apartmentData: ApartmentInfo, thunkAPI) => {
    try {
      const dataToSend = {
        ...apartmentData,
        userId: Number(apartmentData.userId),
        societyId: Number(apartmentData.societyId),
      };
      const response = await ApartmentService.createApartment(dataToSend);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create apartments"
      );
    }
  }
);

// Update apartments by ID
export const updateApartmentById = createAsyncThunk(
  "apartment/updateApartmentById",
  async ({ id, data }: { id: string; data: ApartmentInfo }, thunkAPI) => {
    try {
      const { users, society, ...restData } = data;
      const dataToSend = {
        ...restData,
        userId: Number(data.userId),
        societyId: Number(data.societyId),
      };
      const response = await ApartmentService.updateApartment(id, dataToSend);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update apartments"
      );
    }
  }
);

// Delete apartments by ID
export const deleteApartmentById = createAsyncThunk(
  "apartment/deleteApartmentById",
  async (id: string, thunkAPI) => {
    try {
      await ApartmentService.deleteApartment(id);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete apartments"
      );
    }
  }
);

const apartmentSlice = createSlice({
  name: "apartment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllApartment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllApartment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllApartment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })

      // Create apartments
      .addCase(createApartment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createApartment.fulfilled,
        (state, action: PayloadAction<ApartmentInfo>) => {
          state.status = "succeeded";
          state.data?.push(action.payload);
          state.error = null;
        }
      )
      .addCase(createApartment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Update apartments
      .addCase(updateApartmentById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        updateApartmentById.fulfilled,
        (state, action: PayloadAction<ApartmentInfo>) => {
          state.status = "succeeded";
          if (state.data) {
            const index = state.data.findIndex(
              (data) => data.id === action.payload.id
            );

            // Check if the index is valid
            if (index !== -1) {
              state.data[index] = { ...state.data[index], ...action.payload };
            }
          }
          state.error = null;
        }
      )
      .addCase(updateApartmentById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Delete apartments
      .addCase(deleteApartmentById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(
        deleteApartmentById.fulfilled,
        (state, action: PayloadAction<string | number>) => {
          state.status = "succeeded";
          state.data = state.data
            ? state.data.filter((data) => data.id !== action.payload)
            : null;

          state.error = null;
        }
      )
      .addCase(deleteApartmentById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default apartmentSlice.reducer;
