import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { settingsState } from "../../d";

export const updateColorScheme = createAsyncThunk("settingsSlice/updateColorScheme", async (schemeChange, thunkApi) => {
  try {
    const previousScheme = (thunkApi.getState() as settingsState).settings.clr_pallete
    const newScheme = {...previousScheme, ...schemeChange as any}

    const resp = await axios.put(process.env.NEXT_PUBLIC_API_URL as string + 'settings', {scheme: newScheme})
    console.log(resp);
    return thunkApi.fulfillWithValue(newScheme)
  } catch (error) {
    console.error(error);
    return thunkApi.rejectWithValue(error)
    
  }
});

const initialState: settingsState = {
  show: {
    file: false,
    modal: false,
  },
  settings: {
    clr_pallete: {
      beige1: "rgb(227 216 209)",
      beige2: "#cec8c3",
      beige3: "#d8c3b5",
      gray2: " rgba(58, 59, 74, 0.689)",
      hover_clr: "#393c3e",
      red1: "rgba(219, 42, 42, 0.09)",
      red2: "rgb(168 154 154 / 20%)",
      red3: "rgba(219, 42, 42, 0.197)",
    },
    fnt: {
      family: "poppins",
    },
  },
};

const settingsSlice = createSlice({
  name: "settingsSlice",
  initialState,
  reducers: {
    setShowModal: (state, action) => {
      state.show = { ...state.show, ...action.payload };
    },
  },
  extraReducers: builder =>  {
    builder.addCase(updateColorScheme.fulfilled, (state, action) => {
      // state.settings.clr_pallete = action.payload as any

    })
    builder.addCase(updateColorScheme.rejected, (state, action) => {
      // later
    })
    builder.addCase(updateColorScheme.pending, (state, action) => {
      // later
    })
  }
});

export default settingsSlice.reducer;
export const { setShowModal } = settingsSlice.actions;