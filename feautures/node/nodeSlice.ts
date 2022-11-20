import { createSlice } from "@reduxjs/toolkit";
import { fileNode, folderNode, motherNode, nodeState } from "../../d";

const defaultSelectedNode = new folderNode('main')

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
    openFiles: [],
    contextMenu: {
        selected: null,
        show: false,
        toRename: false,
        cords: {
            top: '',
            left: ''
        }
    }
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
        
    },
})

export default nodeSlice.reducer
export const {pushNode,updateNodeSystem,setSelectedNode,updateCreateNode,setShowContextMenu,} = nodeSlice.actions