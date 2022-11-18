import styles from "../../styles/Sidebar.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {  folderNode } from "../../d";
import CreateNodeForm from "./CreateNodeForm";
import ChildrenNodeMap from "./ChildNodeMap";
import { CSSProperties, HTMLAttributes, MouseEvent } from "react";
import { RootState } from "../../feautures/store";
import { setSelectedNode } from "../../feautures/node/nodeSlice";

export default function FolderRenderer({
  folderNode,
  higherIndex = 0,
}: {
  folderNode: folderNode;
  higherIndex?: number;
}) {
  const { motherNode, createNode, selectedNode } = useSelector(
    (state: RootState) => state.motherNode
  );
  const dispatch = useDispatch();
  const childNodes = motherNode.filter((node) => {
    return node.precursor === folderNode.folderPath;
  });

  const makeElementStyles = (createNode.folder || createNode.file) && (((selectedNode.toCreate) as folderNode).folderPath === folderNode.folderPath)
  const folderNameStyles: CSSProperties = {
    paddingLeft: `${higherIndex * 10}px`,
    backgroundColor: (selectedNode.toSelect as folderNode).folderPath === folderNode.folderPath ? 'rgb(227 216 209)' : ''
  }
  
  function openContextMenu(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>){
    e.preventDefault()
    console.log('first');

  }
  
  const folderNameEventListeners: HTMLAttributes<HTMLDivElement> = {
    style: folderNameStyles,
    onClick:() => dispatch(setSelectedNode({
      toCreate: folderNode,
      toSelect: folderNode
    })),
    className:styles.node_name,
    onContextMenu:(e) => openContextMenu(e) ,
  }
  return (
    <div className={styles.folder}>
        {
            // @ts-ignore
            higherIndex > 0 ? <div style={{'--higherIndex': higherIndex}} className={styles.index_line}></div> : undefined
        }

      <div
        {...folderNameEventListeners}
      >
        {folderNode.folderName}
      </div>

        {
            makeElementStyles ? <CreateNodeForm higherIndex={higherIndex} /> : undefined
        }
        
      <ChildrenNodeMap  children={childNodes}  higherIndex={higherIndex} />
    </div>
  );
}
