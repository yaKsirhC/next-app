import styles from "../../styles/Sidebar.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { folderNode } from "../../d";
import { folderNode as folderNodeConstructor, fileNode as fileNodeConstructor } from "../../d";
import CreateNodeForm from "./CreateNodeForm";
import ChildrenNodeMap from "./ChildNodeMap";
import { createContext, CSSProperties, FocusEvent, HTMLAttributes, MouseEvent, useState } from "react";
import { RootState } from "../../feautures/store";
import { renameElement, setSelectedNode, setShowContextMenu, updateNodeSystem } from "../../feautures/node/nodeSlice";
import axios from "axios";
import { AsyncThunkAction } from "@reduxjs/toolkit";
import { AnyAsyncThunk } from "@reduxjs/toolkit/dist/matchers";

export const renameActionContextFolder = createContext<any>(null);

export default function FolderRenderer({ folderNode, higherIndex = 1 }: { folderNode: folderNode; higherIndex?: number }) {
  const { motherNode, createNode, selectedNode, contextMenu } = useSelector((state: RootState) => state.motherNode);
  const dispatch = useDispatch();
  const childNodes = motherNode.filter((node) => {
    return node.precursor === folderNode.elementPath;
  });
  const makeElementStyles = (createNode.folder || createNode.file) && selectedNode.toCreate.elementPath === folderNode.elementPath;

  const [folderName, setFolderName] = useState(folderNode.elementName);

  function openContextMenu(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
    e.preventDefault();
    const cords = {
      top: `${e.clientY}px`,
      left: `${e.clientX}px`,
    };
    dispatch(setShowContextMenu({ show: true, selected: folderNode, cords }));
  }

  const folderNameStyles: CSSProperties = {
    paddingLeft: `${higherIndex * 10}px`,
    backgroundColor: selectedNode.toSelect.elementPath === folderNode.elementPath ? "var(--hover_clr)" : "",
  };

  const folderNameEventListeners: HTMLAttributes<HTMLDivElement> = {
    style: folderNameStyles,
    onClick: () =>
      dispatch(
        setSelectedNode({
          toCreate: folderNode,
          toSelect: folderNode,
        })
      ),
    className: styles.node_name,
    onContextMenu: (e) => openContextMenu(e),
  };

  async function handleModiy(e: FocusEvent<HTMLInputElement, Element>) {
    try {
      dispatch(setShowContextMenu({ show: false, toRename: false, selected: null }));
      if (e.target.value.trim().length == 0) {
        setFolderName(folderNode.elementName);
        return;
      }
      const inputValue = e.target.value;
      const prevPath = folderNode.elementPath.split("/");
      prevPath.splice(-1, 1, inputValue);
      const newNodePath = prevPath.join("/");
      const matchesInd = motherNode.findIndex((node) => {
        return node.elementPath === newNodePath;
      });
      if (matchesInd >= 0) {
        alert("element exists");
        setFolderName(folderNode.elementName);
        return;
      }
      const newNode = folderNode.type === "file" ? new fileNodeConstructor(newNodePath, "") : new folderNodeConstructor(newNodePath);

      const resp = await axios.put((process.env.NEXT_PUBLIC_API_URL as string) + "/node", { newNode: { ...newNode }, oldNode: folderNode });
      dispatch(updateNodeSystem(resp.data.motherNode));
    } catch (error) {
      console.error(error);
    }
  }

  function handleModify(e: FocusEvent<HTMLInputElement, Element>){
    const newPath = e.target.value 
    if (newPath.trim().length == 0) {
        setFolderName(folderNode.elementName);
      return 
    }
    const prevPath = folderNode.elementPath.split("/");
        prevPath.splice(-1, 1, newPath);
        const newNodePath = prevPath.join("/");
        const matchesInd = motherNode.findIndex((node) => {
          return node.elementPath === newNodePath;
        });
    if (matchesInd >= 0) {
      console.log(folderNode.elementName !== newPath);
      if(folderNode.elementName !== newPath){
          alert("element exists");
      }
    setFolderName(folderNode.elementName);
  return
    
  }
    
    // @ts-ignore
    dispatch(renameElement({newPath, previousElement: folderNode}))
  }

  const ifToRename = contextMenu.toRename && contextMenu.selected && contextMenu.selected?.elementPath === folderNode.elementPath;

  return (
    <>
      <div className={styles.folder}>
        {
          // @ts-ignore
          higherIndex > 1 ? <div style={{ "--higherIndex": higherIndex }} className={styles.index_line}></div> : undefined
        }

        <div {...folderNameEventListeners}>
          <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2.3 12H12.7C13.418 12 14 11.4528 14 10.7778V4.05556C14 3.38054 13.418 2.83333 12.7 2.83333H6.85L5.74297 1.27213C5.62241 1.10212 5.41946 1 5.20213 1H2.3C1.58203 1 1 1.54721 1 2.22222V10.7778C1 11.4528 1.58203 12 2.3 12Z"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {ifToRename ? (
            <input onBlur={(e) => handleModify(e)} autoFocus required type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} />
          ) : (
            <>{folderName}</>
          )}
        </div>

        {makeElementStyles ? <CreateNodeForm higherIndex={higherIndex} /> : undefined}

        <ChildrenNodeMap children={childNodes} higherIndex={higherIndex} />
      </div>
    </>
  );
}
