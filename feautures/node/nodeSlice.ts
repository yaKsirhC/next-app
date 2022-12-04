import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { fileNode, folderNode, motherNode, nodeState } from "../../d";
import { RootState } from "../store";

const defaultSelectedNode = new folderNode("main");

export const renameElement = createAsyncThunk("nodeSlice/renameElement", async (payload: any, thunkAPI) => {
  try {
    const newPath = payload.newPath;
    const previousElement = payload.previousElement as fileNode | folderNode;
    const newNode = previousElement.type === "file" ? new fileNode(newPath, (previousElement as fileNode).text) : new folderNode(newPath);
    const resp = await axios.put<{ motherNode: motherNode }>((process.env.NEXT_PUBLIC_API_URL as string) + "/node", {
      newNode: { ...newNode },
      oldNode: previousElement,
    });

    return thunkAPI.fulfillWithValue(resp.data.motherNode);
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue(error);
  }
});

export const moveDroppedElement = createAsyncThunk("nodeSlice/moveDroppedElement", async (payload: any, thunkAPI) => {
  try {
    const dragElement = (thunkAPI.getState() as RootState).motherNode.motherNode.find((el) => el.elementPath === payload.DragElement);
    const resp = await axios.put(process.env.NEXT_PUBLIC_API_URL + "drag", { dragElement, dropElement: payload.dropElement });

    return thunkAPI.fulfillWithValue(resp.data);
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue(error);
  }
});

export const submitTextChange = createAsyncThunk("nodeSlice/submitTextChange", async (payload: any, thunkAPI) => {
  try {
    const state = (thunkAPI.getState() as RootState).motherNode;
    const text = payload;

    const resp = await axios.put<{ motherNode: motherNode }>(process.env.NEXT_PUBLIC_API_URL + "editor", {
      elementPath: state.openFile,
      text,
    });

    return thunkAPI.fulfillWithValue(resp.data.motherNode);
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue(error);
  }
});

export const deleteElement = createAsyncThunk("nodeSlice/deleteElement", async (payload: any, thunkAPI) => {
  try {
    const resp = await axios.delete(process.env.NEXT_PUBLIC_API_URL + "node", { params: { node: payload } });

    return thunkAPI.fulfillWithValue(resp.data.motherNode);
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue(error);
  }
});

export const createElement = createAsyncThunk("nodeSlice/createElement", async (payload: any, thunkAPI) => {
  try {
    const state = (thunkAPI.getState() as RootState).motherNode;
    const newNode = state.createNode.file ? new fileNode(payload, "") : new folderNode(payload);
    const resp = await axios.post<{ motherNode: motherNode }>(process.env.NEXT_PUBLIC_API_URL + "node", { node: newNode });
    return thunkAPI.fulfillWithValue(resp.data.motherNode);
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue(error);
  }
});

export const initialiseMotherNode = createAsyncThunk("nodeSlice/initialiseMotherNode", async (payload, thunkAPI) => {
  try {
    const resp = await axios.get<{ motherNode: { motherNode: motherNode } }>(process.env.NEXT_PUBLIC_API_URL + "node");
    return thunkAPI.fulfillWithValue(resp.data.motherNode);
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue(error);
  }
});

const initialState: nodeState = {
  nodeError: {
    has: false,
    message: "",
  },
  isLoadingNode: true,
  motherNode: [],
  createNode: {
    file: false,
    folder: false,
  },
  selectedNode: {
    toCreate: { ...defaultSelectedNode },
    toSelect: { ...defaultSelectedNode },
  },
  contextMenu: {
    selected: null,
    show: false,
    toRename: false,
    cords: {
      top: "",
      left: "",
    },
  },
  openFile: null,
  tabFiles: [],
};

const nodeSlice = createSlice({
  name: "nodeSlice",
  initialState,

  reducers: {
    setLoadingNodeSlice: (state, action) => {
      state.isLoadingNode = action.payload;
    },
    pushNode: (state, action) => {
      state.motherNode.push(action.payload);
    },
    updateNodeSystem: (state, action) => {
      state.motherNode = action.payload;
    },
    setSelectedNode: (state, action) => {
      if (action.payload === "main") {
        state.selectedNode.toCreate = { ...defaultSelectedNode };
        state.selectedNode.toSelect = { ...defaultSelectedNode };
      } else {
        state.selectedNode = action.payload;
      }
    },
    updateCreateNode: (state, action) => {
      state.createNode = action.payload;
    },
    setShowContextMenu: (state, action) => {
      state.contextMenu = { ...state.contextMenu, ...action.payload };
    },
    setOpenFile: (state, action) => {
      state.openFile = action.payload;
      const match = state.tabFiles.findIndex((file) => {
        return file === action.payload;
      });
      if (match < 0) {
        state.tabFiles.push(action.payload);
      }
    },
    closeFile: (state, action) => {
      const file = action.payload as fileNode;
      const fileIndex = state.tabFiles.findIndex((el) => {
        return el === file.elementPath;
      });
      if (file.elementPath === state.openFile) {
        state.openFile = fileIndex - 1 >= 0 ? state.tabFiles[fileIndex - 1] : fileIndex + 1 <= state.tabFiles.length - 1 ? state.tabFiles[fileIndex + 1] : null;
      }
      state.tabFiles.splice(fileIndex, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(renameElement.pending, (state, action) => {
      state.isLoadingNode = true;
    });
    builder.addCase(renameElement.rejected, (state, action) => {
      state.nodeError.has = true;
      state.isLoadingNode = false;
      state.contextMenu = { ...state.contextMenu, ...{ selected: null, show: false, toRename: false } };
      state.motherNode = state.motherNode;
    });
    builder.addCase(renameElement.fulfilled, (state, action) => {
      state.isLoadingNode = false;
      state.contextMenu = { ...state.contextMenu, ...{ selected: null, show: false, toRename: false } };
      state.motherNode = action.payload as unknown as any;
    });
    builder.addCase(moveDroppedElement.pending, (state, action) => {
      state.isLoadingNode = true;
    });
    builder.addCase(moveDroppedElement.rejected, (state, action) => {
      state.nodeError.has = true;
      state.isLoadingNode = false;
      // state.contextMenu = {...state.contextMenu, ...{selected: null,show: false, toRename: false}}
      // state.motherNode = state.motherNode
    });
    builder.addCase(moveDroppedElement.fulfilled, (state, action) => {
      state.isLoadingNode = false;
      state.motherNode = action.payload as any;
      // state.contextMenu = {...state.contextMenu, ...{selected: null,show: false, toRename: false}}
      // state.motherNode = action.payload as unknown as any
    });
    builder.addCase(submitTextChange.pending, (state, action) => {
      state.isLoadingNode = true;
    });
    builder.addCase(submitTextChange.rejected, (state, action) => {
      state.nodeError.has = true;
      state.isLoadingNode = false;
    });

    builder.addCase(submitTextChange.fulfilled, (state, action) => {
      state.isLoadingNode = false;
      state.motherNode = action.payload as any;
    });
    builder.addCase(deleteElement.pending, (state, action) => {
      state.isLoadingNode = true;
    });
    builder.addCase(deleteElement.rejected, (state, action) => {
      state.nodeError.has = true;
      state.isLoadingNode = false;
    });

    builder.addCase(deleteElement.fulfilled, (state, action) => {
      state.isLoadingNode = false;
      state.motherNode = action.payload as any;
      state.contextMenu = { ...state.contextMenu, ...{ selected: null, show: false, toRename: false } };
      state.selectedNode.toCreate = { ...defaultSelectedNode };
      state.selectedNode.toSelect = { ...defaultSelectedNode };
    });
    builder.addCase(createElement.pending, (state, action) => {
      state.isLoadingNode = true;
    });
    builder.addCase(createElement.rejected, (state, action) => {
      state.nodeError.has = true;
      state.isLoadingNode = false;
    });

    builder.addCase(createElement.fulfilled, (state, action) => {
      state.isLoadingNode = false;
      state.createNode = {file: false, folder: false}
      state.motherNode = action.payload as any;
    });

    builder.addCase(initialiseMotherNode.pending, (state, action) => {
      state.isLoadingNode = true;
    });
    builder.addCase(initialiseMotherNode.rejected, (state, action) => {
      state.nodeError.has = true;
      state.isLoadingNode = false;
    });
    builder.addCase(initialiseMotherNode.fulfilled, (state, action) => {
      state.isLoadingNode = false;
      state.motherNode = action.payload as any;
    });
  },
});

export default nodeSlice.reducer;
export const { pushNode, updateNodeSystem, setSelectedNode, updateCreateNode, setShowContextMenu, closeFile, setOpenFile } = nodeSlice.actions;
