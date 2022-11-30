import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { clr_pallete, settingsState } from "../../d";
import { RootState } from "../store";

export const updateColorScheme = createAsyncThunk("settingsSlice/updateColorScheme", async (schemeChange, thunkApi) => {
  try {
    const previousScheme = (thunkApi.getState() as RootState).settings.settings.clr_pallete as clr_pallete
    const newScheme = {...previousScheme, ...schemeChange as any}

    const resp = await axios.put(process.env.NEXT_PUBLIC_API_URL as string + 'settings', {scheme: newScheme})
    return thunkApi.fulfillWithValue<{settings: {}}>(resp.data)
  } catch (error) {
    console.error(error);
    return thunkApi.rejectWithValue(error)
    
  }
});

const initialState: settingsState = {
  show: {
    editor: false,
    modal: false,
  },
  settings: {
    _v: 1,
    clr_pallete: {
      beige_1: "rgb(227 216 209)",
      beige_2: "#cec8c3",
      beige_3: "#d8c3b5",
      gray_2: " rgba(58, 59, 74, 0.689)",
      hover_clr: "#393c3e",
      red_1: "rgba(219, 42, 42, 0.09)",
      red_2: "rgb(168 154 154 / 20%)",
      red_3: "rgba(219, 42, 42, 0.197)",
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
      // @ts-ignore
      state.settings = action.payload.settings

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