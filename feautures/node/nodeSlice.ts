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
        }
    },
})

export default nodeSlice.reducer
export const {pushNode,updateNodeSystem,setSelectedNode,updateCreateNode,setShowContextMenu,closeFile,fakeUpdateText,setOpenFile} = nodeSlice.actions