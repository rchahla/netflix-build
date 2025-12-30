import { createSlice } from "@reduxjs/toolkit";

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    subscription: null,
  },
  reducers: {
    setSubscription: (state, action) => {
      state.subscription = action.payload;
    },
    clearSubscription: (state) => {
      state.subscription = null;
    },
  },
});

export const { setSubscription, clearSubscription } = subscriptionSlice.actions;

export const selectSubscription = (state) => state.subscription.subscription;

export default subscriptionSlice.reducer;
