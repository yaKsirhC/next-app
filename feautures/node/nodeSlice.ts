import { createSlice } from "@reduxjs/toolkit";
import { motherNode } from "../../d";

const initialState: motherNode = []

const nodeSlice = createSlice({
    name: 'nodeSlice',
    initialState,

    reducers: {
        
    }
})

export default nodeSlice.reducer
