import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedStudentId: "",
  selectedArea: "",
  timeDuration: "30",
  price: 2000,
  mentor: null,
  loading: false,
  startTiming: "", 
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setSelectedStudentId: (state, action) => {
      state.selectedStudentId = action.payload;
    },
    setSelectedArea: (state, action) => {
      state.selectedArea = action.payload;
    },
    setTimeDuration: (state, action) => {
      state.timeDuration = action.payload;
      if (action.payload === "30") state.price = 2000;
      if (action.payload === "45") state.price = 3000;
      if (action.payload === "60") state.price = 4000;
    },
    setMentor: (state, action) => {
      state.mentor = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addPremiumCharge: (state) => {
      state.price += 650;
    },
    setStartTiming: (state, action) => { 
      state.startTiming = action.payload;
    },
  },
});

export const {
  setSelectedStudentId,
  setSelectedArea,
  setTimeDuration,
  setMentor,
  setLoading,
  addPremiumCharge,
  setStartTiming, // Export the new action
} = bookingSlice.actions;

export default bookingSlice.reducer;
