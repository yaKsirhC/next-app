import { configureStore, Store } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import nodeSlice from "./node/nodeSlice";

const store = () =>  configureStore({
    reducer:{
        motherNode: nodeSlice
    }
})

export type RootStore = ReturnType<typeof store>
export type RootState = ReturnType<RootStore["getState"]>
export default store
export const wrapper = createWrapper<RootStore>(store)