import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/reducers/user.reducer";
import societyReducer from "@/reducers/society.reducer";
import allUserReducer from "@/reducers/getAlluser.reducer";
import apartmentReducer from "@/reducers/apartment.reducer";
import visitorReducer from "@/reducers/visitor.reducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    alluser: allUserReducer,
    society: societyReducer,
    apartment: apartmentReducer,
    visitor: visitorReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
