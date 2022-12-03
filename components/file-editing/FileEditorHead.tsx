import { CSSProperties, UIEvent } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setOpenFile } from "../../feautures/node/nodeSlice"
import { RootState } from "../../feautures/store"
import FileEditorHeadTab from "./FileEditorHeadTab"
import styles from '../../styles/FileEditors.module.scss'
 
export default function FileEditorHead(){
    const {tabFiles,motherNode} = useSelector((state: RootState) => state.motherNode)    

    function handleScroll(e: UIEvent<HTMLDivElement, globalThis.UIEvent>){
    }

    return (
        <div onScroll={e => handleScroll(e)} className={styles.tabs}>
        {
            tabFiles.map((file, i) => {
                const openFile = motherNode.find(el => el.elementPath === file) 
                return <FileEditorHeadTab file={openFile as any} key={i}/>            
            })
        }
        </div>
    )
}