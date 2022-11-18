import style from "../../styles/Sidebar.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fileNode, folderNode } from "../../d";
import { setSelectedNode, setShowContextMenu } from "../../feautures/node/nodeSlice";
import { CSSProperties, HTMLAttributes, MouseEvent, useState } from "react";
import { RootState } from "../../feautures/store";
import ContextMenu from "./ContextMenu";

export default function FileRenderer({
  fileNode,
  higherIndex = 0,
}: {
  fileNode: fileNode;
  higherIndex?: number;
}) {
  const dispatch = useDispatch();
  const precursorNode = new folderNode(fileNode.precursor);
  const {contextMenu,selectedNode} = useSelector((state: RootState) => state.motherNode)
  const [cords, setCords] = useState({
    contextTop : '0px',
    contextLeft : '0px'

  })


  function openContextMenu(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>){
    e.preventDefault()
    dispatch(setShowContextMenu({show: true, selected: fileNode}))
    setCords({contextTop: `${e.clientY}px)`, contextLeft: `${e.clientX}px`})
    
  }

  const folderNameStyles: CSSProperties = {
    paddingLeft: `${higherIndex * 10}px`,
    backgroundColor: (selectedNode.toSelect as fileNode).filePath === fileNode.filePath ? 'rgb(227 216 209)' : ''
  }

  const fileNameEventListeners: HTMLAttributes<HTMLDivElement> = {
    style: folderNameStyles,
    onClick:() => dispatch(setSelectedNode({
      toCreate: {...precursorNode},
      toSelect: fileNode
    })),
    className: style.node_name,
    onContextMenu:(e) => openContextMenu(e) ,
  }

  const ifContextMenu = contextMenu.show && contextMenu.selected && (contextMenu.selected as fileNode).filePath === fileNode.filePath 

  return (
    <>
      
      {/*  @ts-ignore */}
      <div style={{ "--higherIndex": higherIndex }}className={style.index_line}></div>
      <div {...fileNameEventListeners}>
        {fileNode.fileName}
      </div>
        {
          ifContextMenu ? (
            <ContextMenu nodePath={fileNode.filePath} left={cords.contextLeft} top={cords.contextTop} />
          ) 
          : undefined
        }
    </>
  );
}
