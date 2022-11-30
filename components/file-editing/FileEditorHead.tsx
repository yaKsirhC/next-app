import { CSSProperties } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setOpenFile } from "../../feautures/node/nodeSlice"
import { RootState } from "../../feautures/store"
import FileEditorHeadTab from "./FileEditorHeadTab"
import styles from '../../styles/FileEditors.module.scss'
 
export default function FileEditorHead(){
    const {tabFiles} = useSelector((state: RootState) => state.motherNode)    

    return (
        <div className={styles.tabs}>
        {
            tabFiles.map((file, i) => {
                return <FileEditorHeadTab file={file} key={i}/>            
            })
        }
        </div>
    )
}