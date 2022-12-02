import style from "../../styles/Sidebar.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fileNode, folderNode } from "../../d";
import { fileNode as fileNodeConstructor, folderNode as folderNodeCunstructor } from "../../d";
import { setSelectedNode, setShowContextMenu, updateNodeSystem, } from "../../feautures/node/nodeSlice";
import { createContext, CSSProperties, FocusEvent, HTMLAttributes, MouseEvent, useRef, useState } from "react";
import { RootState } from "../../feautures/store";
import axios from "axios";
import Router from "next/router";
import { closeFile, setOpenFile } from "../../feautures/node/nodeSlice";

export const renameActionContextFile = createContext<any>(null)

export default function FileRenderer({
  fileNode,
  higherIndex = 1,
}: {
  fileNode: fileNode;
  higherIndex?: number;
}) {
  const dispatch = useDispatch();
  const precursorNode = new folderNode(fileNode.precursor);
  const {contextMenu,selectedNode,motherNode,tabFiles,openFile} = useSelector((state: RootState) => state.motherNode)
  const [fileName, setFileName] = useState(fileNode.fileName)
  const inputRefFile = useRef() as React.MutableRefObject<HTMLInputElement>;

  function openContextMenu(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>){
    e.preventDefault()
    const cords ={
      top: `${e.clientY}px`,
      left: `${e.clientX}px`
    }
    dispatch(setShowContextMenu({show: true, selected: fileNode, cords}))
  }

  const fileNameStyles: CSSProperties = {
    paddingLeft: `${higherIndex * 10}px`,
    backgroundColor: selectedNode.toSelect.elementPath === fileNode.elementPath ? 'var(--hover_clr)' : ''
  }

  const fileNameEventListeners: HTMLAttributes<HTMLDivElement> = {
    style: fileNameStyles,
    onClick:() => {
      
     dispatch(setSelectedNode({
      toCreate: {...precursorNode},
      toSelect: fileNode
    }))

    dispatch(setOpenFile(fileNode.elementPath))

  },
    className: style.node_name,
    onContextMenu:(e) => openContextMenu(e) ,
  }


  async function handleModify(e: FocusEvent<HTMLInputElement, Element>){
    try {
    dispatch(setShowContextMenu({selected: null, toRename: false, show: false}))
    if(e.target.value.trim().length == 0) {
      setFileName(fileNode.elementName)
      return
    } 
    const inputValue = e.target.value;
    const prevPath = fileNode.elementPath.split("/");
    prevPath.splice(-1, 1, inputValue);
    const newNodePath = prevPath.join("/");
    const matchesInd = motherNode.findIndex(node => {
      return node.elementPath === newNodePath
    })
    if(matchesInd >= 0) {
      setFileName(fileNode.elementName)
      alert('element already exists')
      return
    }
    const newNode =
      fileNode.type === "file"
        ? new fileNodeConstructor(newNodePath, "")
        : new folderNodeCunstructor(newNodePath);

    const resp = await axios.put(
      (process.env.NEXT_PUBLIC_API_URL as string) + "/node",
      { newNode: { ...newNode }, oldNode: fileNode }
    );
    dispatch(updateNodeSystem(resp.data.motherNode))
    const match = tabFiles.findIndex(el => {return el === fileNode.elementPath})
    if(match > -1){
      dispatch(closeFile(fileNode))
      dispatch(setOpenFile(newNode.elementPath))
    }
  } catch (error) {
    console.error(error);
  }
  }

  const ifToRename = contextMenu.toRename && contextMenu.selected?.elementPath === fileNode.elementPath

  return (
    <>
      {
            // @ts-ignore
            higherIndex > 1 ? <div style={{'--higherIndex': higherIndex}} className={style.index_line}></div> : undefined
        }

      <div {...fileNameEventListeners}>
      <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.34034 9.4285H5.0042C4.85674 9.4285 4.71531 9.49058 4.61104 9.60109C4.50676 9.71161 4.44818 9.86149 4.44818 10.0178C4.44818 10.1741 4.50676 10.324 4.61104 10.4345C4.71531 10.545 4.85674 10.6071 5.0042 10.6071H8.34034C8.48781 10.6071 8.62923 10.545 8.73351 10.4345C8.83778 10.324 8.89636 10.1741 8.89636 10.0178C8.89636 9.86149 8.83778 9.71161 8.73351 9.60109C8.62923 9.49058 8.48781 9.4285 8.34034 9.4285Z" fill="#231F20"/>
      <path d="M5.0042 8.24995H6.67227C6.81974 8.24995 6.96116 8.18786 7.06544 8.07735C7.16971 7.96684 7.22829 7.81695 7.22829 7.66066C7.22829 7.50438 7.16971 7.35449 7.06544 7.24398C6.96116 7.13347 6.81974 7.07138 6.67227 7.07138H5.0042C4.85674 7.07138 4.71531 7.13347 4.61104 7.24398C4.50676 7.35449 4.44818 7.50438 4.44818 7.66066C4.44818 7.81695 4.50676 7.96684 4.61104 8.07735C4.71531 8.18786 4.85674 8.24995 5.0042 8.24995Z" fill="#231F20"/>
      <path d="M10.9759 4.9087L7.95109 1.37301C7.89911 1.31196 7.83564 1.26312 7.76478 1.22963C7.69392 1.19614 7.61723 1.17874 7.53964 1.17854H3.64748C3.46274 1.17621 3.27938 1.21246 3.10786 1.28524C2.93634 1.35801 2.78003 1.46588 2.64785 1.60268C2.51567 1.73948 2.41021 1.90254 2.3375 2.08254C2.26478 2.26254 2.22624 2.45596 2.22406 2.65175V11.491C2.22624 11.6868 2.26478 11.8802 2.3375 12.0602C2.41021 12.2402 2.51567 12.4032 2.64785 12.5401C2.78003 12.6769 2.93634 12.7847 3.10786 12.8575C3.27938 12.9303 3.46274 12.9665 3.64748 12.9642H9.697C9.88174 12.9665 10.0651 12.9303 10.2366 12.8575C10.4081 12.7847 10.5645 12.6769 10.6966 12.5401C10.8288 12.4032 10.9343 12.2402 11.007 12.0602C11.0797 11.8802 11.1182 11.6868 11.1204 11.491V5.30352C11.1201 5.15747 11.0685 5.01677 10.9759 4.9087ZM7.78429 2.94639L9.30779 4.71424H8.19574C8.13752 4.71051 8.08057 4.69453 8.02824 4.66723C7.9759 4.63993 7.92922 4.60185 7.89092 4.55523C7.85261 4.5086 7.82346 4.45435 7.80515 4.39565C7.78684 4.33696 7.77975 4.27498 7.78429 4.21335V2.94639ZM9.697 11.7856H3.64748C3.60876 11.788 3.56999 11.7823 3.53337 11.7688C3.49675 11.7552 3.46301 11.7342 3.43408 11.7068C3.40516 11.6794 3.38161 11.6463 3.3648 11.6092C3.34799 11.5722 3.33823 11.532 3.33611 11.491V2.65175C3.33823 2.61071 3.34799 2.57052 3.3648 2.53349C3.38161 2.49645 3.40516 2.4633 3.43408 2.43593C3.46301 2.40856 3.49675 2.3875 3.53337 2.37398C3.56999 2.36045 3.60876 2.35472 3.64748 2.35711H6.67224V4.21335C6.66326 4.64743 6.81667 5.06764 7.09897 5.38229C7.38127 5.69693 7.76955 5.88046 8.17906 5.8928H10.0084V11.491C10.0062 11.532 9.9965 11.5722 9.97968 11.6092C9.96287 11.6463 9.93932 11.6794 9.9104 11.7068C9.88147 11.7342 9.84773 11.7552 9.81111 11.7688C9.7745 11.7823 9.73572 11.788 9.697 11.7856Z" fill="#231F20"/>
      </svg>

      {
          ifToRename ? (
            <input onBlur={e => handleModify(e)} autoFocus ref={inputRefFile} type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} />
            ):
            <>{fileName}</>

        }
      </div>
    </>
  );
}
