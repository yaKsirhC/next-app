import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { fileNode, folderNode, motherNode, nodeState } from "../../d";
import { RootState } from "../store";

const defaultSelectedNode = new folderNode('main')

export const renameElement = createAsyncThunk('nodeSlice/renameElement', async (action: any, thunkAPI) => {
    try {
        console.log(action);
        const newPath = action.newPath
        const previousElement = action.previousElement as (fileNode | folderNode)
        const newNode = previousElement.type === "file" ? new fileNode(newPath, (previousElement as fileNode).text) : new folderNode(newPath);
        const resp = await axios.put<{motherNode: motherNode }>((process.env.NEXT_PUBLIC_API_URL as string) + "/node", { newNode: { ...newNode }, oldNode: previousElement });
        
        return thunkAPI.fulfillWithValue(resp.data.motherNode)
      } catch (error) {
        console.error(error);
        return thunkAPI.rejectWithValue(error)
      }
})

const initialState: nodeState = {
    motherNode: [],
    createNode: {
        file: false,
        folder: false
    },
    selectedNode: {
        toCreate: {...defaultSelectedNode},
        toSelect: {...defaultSelectedNode}
    },
    contextMenu: {
        selected: null,
        show: false,
        toRename: false,
        cords: {
            top: '',
            left: ''
        }
    },
    openFile: null,
    tabFiles: [],
}

const nodeSlice = createSlice({
    name: 'nodeSlice',
    initialState,

    reducers: {
        pushNode: (state, action) => {
            state.motherNode.push(action.payload)
        },
        updateNodeSystem:(state, action) => {
            state.motherNode = action.payload
        },
        setSelectedNode: (state, action) =>{
            if(action.payload === 'main') {
                state.selectedNode.toCreate = {...defaultSelectedNode}
                state.selectedNode.toSelect = {...defaultSelectedNode}
            }
            else{
                state.selectedNode = action.payload
                
            }
        },
        updateCreateNode: (state, action) => {
            state.createNode = action.payload
        },
        setShowContextMenu: (state, action) => {
            state.contextMenu = {...state.contextMenu, ...action.payload}
        },
        setOpenFile: (state, action) => {
            state.openFile = action.payload
            const match = state.tabFiles.findIndex(file => {
                return file === action.payload
            })
            if(match < 0){
                state.tabFiles.push(action.payload)
            }

        },
        fakeUpdateText: (state, action) => {
            const openFileNode = state.motherNode.find(el => el.elementPath === state.openFile) as fileNode
            openFileNode.text = action.payload
        },
        closeFile: (state, action) => {
            const file = action.payload as fileNode
            const fileIndex = state.tabFiles.findIndex(el => {return el ===  file.elementPath})
            if(file.elementPath === state.openFile){
                state.openFile = fileIndex -1 >= 0 ? state.tabFiles[fileIndex-1] : fileIndex + 1 <= state.tabFiles.length -1 ? state.tabFiles[fileIndex + 1] : null
            }
            state.tabFiles.splice(fileIndex,1)
        },

    },
    extraReducers: builder => {
        builder.addCase(renameElement.pending,(state, action) => {})
        builder.addCase(renameElement.rejected,(state, action) => {
            state.contextMenu = {...state.contextMenu, ...{selected: null,show: false, toRename: false}}
            console.log('failed');
            state.motherNode = state.motherNode
        })
        builder.addCase(renameElement.fulfilled,(state, action) => {
            state.contextMenu = {...state.contextMenu, ...{selected: null,show: false, toRename: false}}
            state.motherNode = action.payload as unknown as any
        })
    }
})

export default nodeSlice.reducer
export const {pushNode,updateNodeSystem,setSelectedNode,updateCreateNode,setShowContextMenu,closeFile,fakeUpdateText,setOpenFile} = nodeSlice.actions