import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { clr_pallete, fnt, settingsState } from "../../d";
import { RootState } from "../store";

export const updateSettings = createAsyncThunk("settingsSlice/updateColorScheme", async ({schemeChange, fontSettings}: any, thunkAPI) => {
  try {
    const previousScheme = (thunkAPI.getState() as RootState).settings.settings.clr_pallete as clr_pallete
    const newScheme = {...previousScheme, ...schemeChange as any}
    const previousFntSettings = (thunkAPI.getState() as RootState).settings.settings.fnt as fnt
    const newFontSettings = {...previousFntSettings, ...fontSettings as any}

    const resp = await axios.put(process.env.NEXT_PUBLIC_API_URL as string + 'settings', {scheme: newScheme, font: newFontSettings})
    return thunkAPI.fulfillWithValue<{settings: {}}>(resp.data);

  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue(error)
    
  }
});

export const initialiseSettings = createAsyncThunk('settingsSlice/initialiseSettings', async (payload, thunkAPI) => {
  try {
    const resp = await axios.get(process.env.NEXT_PUBLIC_API_URL + "settings");
    return thunkAPI.fulfillWithValue(resp.data)
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue(error)
    
  }
})

const initialState: settingsState = {
  settingsError: {
    has: false,
    message:''
  },
  isLoadingSettings: true,
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
      active_clr: "#393c3e",
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
    setLoadingSettingsSlice: (state, action) => {
      state.isLoadingSettings = action.payload
    },
    setShowModal: (state, action) => {
      state.show = { ...state.show, ...action.payload };
    },
    updateSettings: (state, action) => {
      state.settings = action.payload
    }
  },
  extraReducers: builder =>  {
    builder.addCase(updateSettings.fulfilled, (state, action) => {
      // @ts-ignore
      state.settings = action.payload.settings
      state.isLoadingSettings = false
    })
    builder.addCase(updateSettings.rejected, (state, action) => {
      state.settingsError.has = true
      state.isLoadingSettings = false
      // later
    })
    builder.addCase(updateSettings.pending, (state, action) => {
      // later
      state.isLoadingSettings = true
    })
    builder.addCase(initialiseSettings.fulfilled, (state, action) => {
      // @ts-ignore
      state.settings = action.payload.settings
      state.isLoadingSettings = false
    })
    builder.addCase(initialiseSettings.rejected, (state, action) => {
      state.settingsError.has = true
      state.isLoadingSettings = false
      // later
    })
    builder.addCase(initialiseSettings.pending, (state, action) => {
      // later
      state.isLoadingSettings = true
    })
  }
});

export default settingsSlice.reducer;
export const { setShowModal } = settingsSlice.actions;