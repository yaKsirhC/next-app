import { createSlice } from "@reduxjs/toolkit";
import { editorState, fileNode } from "../../d";

const initialState: editorState = {
    openFile: null,
    tabFiles: [],
    hotHTML: false
}

const editorSlice = createSlice({
    initialState,
    name: 'editor',
    reducers: {
        openFile: (state, action) => {
            state.openFile = action.payload
            const match = state.tabFiles.findIndex(file => {
                return file.elementPath === action.payload.elementPath
            })
            if(match < 0){
                state.tabFiles.push(action.payload)
            }

        },
        fakeUpdateText: (state, action) => {
            (state.openFile as fileNode).text = action.payload
        },
        toggleHotHTML: (state, action) => {
            state.hotHTML = !(state.hotHTML)
        }
    }
})

export default editorSlice.reducer
export const {openFile,fakeUpdateText,toggleHotHTML} = editorSlice.actions