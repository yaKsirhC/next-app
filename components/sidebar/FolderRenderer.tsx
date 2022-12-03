import styles from "../../styles/Sidebar.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { folderNode } from "../../d";
import CreateNodeForm from "./CreateNodeForm";
import ChildrenNodeMap from "./ChildNodeMap";
import { createContext, CSSProperties, FocusEvent, HTMLAttributes, MouseEvent, useState } from "react";
import { RootState } from "../../feautures/store";
import { moveDroppedElement, renameElement, setSelectedNode, setShowContextMenu } from "../../feautures/node/nodeSlice";

export const renameActionContextFolder = createContext<any>(null);

export default function FolderRenderer({ folderNode, higherIndex = 1 }: { folderNode: folderNode; higherIndex?: number }) {
  const { motherNode, createNode, selectedNode, contextMenu } = useSelector((state: RootState) => state.motherNode);
  const dispatch = useDispatch();
  const childNodes = motherNode.filter((node) => {
    return node.precursor === folderNode.elementPath;
  });
  const makeElementStyles = (createNode.folder || createNode.file) && selectedNode.toCreate.elementPath === folderNode.elementPath;
  const [folderName, setFolderName] = useState(folderNode.elementName);
  const [showChildren, setShowChildren] = useState(false);

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
      onDoubleClick: e => {
        setShowChildren(pre => !pre)
      },
    onDrop: (e) => {
      const elPath = e.dataTransfer.getData("app/drag");
      const elPrecursor = elPath.split("/").slice(0, -1).join("/");
      (e.target as HTMLDivElement).style.backgroundColor = "";
      (e.target as HTMLDivElement).style.outline = "none";
      // @ts-ignore
      dispatch(moveDroppedElement({ dropElement: folderNode, DragElement: elPath }));
    },
    onDragOver: (e) => {
      e.preventDefault();
    },
    onDragEnter: (e) => {
      const elPath = (e.target as HTMLDivElement).getAttribute("data-element-path");
      const elPrecursor = elPath?.split("/").slice(0, -1).join("/");
      (e.target as HTMLDivElement).style.backgroundColor = "rgba(255, 255, 255)";
      (e.target as HTMLDivElement).style.outline = "1px dotted black";
      e.dataTransfer.dropEffect = "move";
    },
    onDragLeave: (e) => {
      (e.target as HTMLDivElement).style.backgroundColor = "";
      (e.target as HTMLDivElement).style.outline = "none";
    },
    onDragStart: (e) => {
      e.dataTransfer.setData("app/drag", folderNode.elementPath);
      e.dataTransfer.effectAllowed = "move";
    },
    onContextMenu: (e) => openContextMenu(e),
    className: styles.node_name,
    draggable: true,
  };

  function handleModify(e: FocusEvent<HTMLInputElement, Element>) {
    const newPath = e.target.value;
    if (newPath.trim().length == 0) {
      setFolderName(folderNode.elementName);
      return;
    }
    const prevPath = folderNode.elementPath.split("/");
    prevPath.splice(-1, 1, newPath);
    const newNodePath = prevPath.join("/");
    const matchesInd = motherNode.findIndex((node) => {
      return node.elementPath === newNodePath;
    });
    if (matchesInd >= 0) {
      if (folderNode.elementName !== newPath) {
        alert("element exists");
      }
      setFolderName(folderNode.elementName);
      return;
    }

    // @ts-ignore
    dispatch(renameElement({ newPath, previousElement: folderNode }));
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
          <svg
            className={styles.toggle_show}
            onClick={() => setShowChildren((pre) => !pre)}
            width="9"
            height="6"
            viewBox="0 0 9 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 1L4.5 5L1 1" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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
        {showChildren ? <ChildrenNodeMap children={childNodes} higherIndex={higherIndex} /> : undefined}
      </div>
    </>
  );
}
