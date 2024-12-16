import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as VisitorService from "@/services/visitorService";
import { Pagination, VisitorInfo, GetQueryParams } from "@/types";

export interface VisitorState {
  data: VisitorInfo[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: Pagination | null;
}

export interface TableResponse {
  success: boolean;
  message: string;
  data: VisitorInfo[];
  pagination: Pagination;
}
const initialState: VisitorState = {
  data: null,
  status: "idle",
  error: null,
  pagination: null,
};

// Create Visitor
export const createVisitor = createAsyncThunk(
  "visitor/createVisitor",
  async (visitorData: VisitorInfo) => {
    const { apartment, ...data } = visitorData;

    const formattedVisitorData = {
      ...data,
      apartmentId: Number(data.apartmentId),
      visitorscount: Number(data.visitorscount),
      fromdate: data.fromdate ? new Date(data.fromdate).toISOString() : null,
      todate: data.todate ? new Date(data.todate).toISOString() : null,
    };

    const response = await VisitorService.createVisitor(formattedVisitorData);
    return response.data;
  }
);

// Get all Visitor with pagination
export const getAllVisitor = createAsyncThunk(
  "visitor/getAllVisitor",
  async ({ page, limit, search = "" }: GetQueryParams) => {
    const response = await VisitorService.getAllVisitor({
      page,
      limit,
      search,
    });
    return response;
  }
);

// Get Visitor by user
export const getVisitorsByUser = createAsyncThunk(
  "visitor/getVisitorsByUser",
  async (data: any) => {
    const response = await VisitorService.getAllVisitorByUser(data);
    return response.data;
  }
);

// Update Visitor
export const updateVisitor = createAsyncThunk(
  "visitor/updateVisitor",
  async ({ id, data }: { id: string; data: VisitorInfo }) => {
    const { apartment, ...visitorData } = data;

    const formattedVisitorData = {
      ...visitorData,
      apartmentId: Number(visitorData.apartmentId),
      visitorscount: Number(visitorData.visitorscount),
      fromdate: visitorData.fromdate
        ? new Date(visitorData.fromdate).toISOString()
        : null,
      todate: visitorData.todate
        ? new Date(visitorData.todate).toISOString()
        : null,
      arrivedtime: visitorData.arrivedtime
        ? new Date(visitorData.arrivedtime).toISOString()
        : null,
      departedtime: visitorData.departedtime
        ? new Date(visitorData.departedtime).toISOString()
        : null,
    };
    const response = await VisitorService.updateVisitor(
      id,
      formattedVisitorData
    );
    return response;
  }
);

// Delete Visitor
export const deleteVisitor = createAsyncThunk(
  "visitor/deleteVisitor",
  async (id: string) => {
    const response = await VisitorService.deleteVisitor(id);
    return { id, ...response.data };
  }
);

const visitorSlice = createSlice({
  name: "visitor",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Visitor
    builder
      .addCase(createVisitor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createVisitor.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createVisitor.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to create Visitor";
      });

    // Get all Visitor
    builder
      .addCase(getAllVisitor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getAllVisitor.fulfilled,
        (state, action: PayloadAction<TableResponse>) => {
          state.status = "succeeded";
          state.data = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(getAllVisitor.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch Visitors";
      });

    // Get Visitor by user
    builder
      .addCase(getVisitorsByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getVisitorsByUser.fulfilled,
        (state, action: PayloadAction<TableResponse>) => {
          state.status = "succeeded";
          state.data = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(getVisitorsByUser.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message ?? "Failed to fetch Visitors by user";
      });

    // Update Visitor
    builder
      .addCase(updateVisitor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateVisitor.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateVisitor.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to update Visitor";
      });

    // Delete Visitor
    builder
      .addCase(deleteVisitor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteVisitor.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteVisitor.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to delete Visitor";
      });
  },
});

export default visitorSlice.reducer;
