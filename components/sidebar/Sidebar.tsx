import style from "../../styles/Sidebar.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fileNode, folderNode } from "../../d";
import { RootState } from "../../feautures/store";
import FileRenderer from "./FileRenderer";
import FolderRenderer from "./FolderRenderer";
import SidebarHeader from "./SideBarHeader";
import { moveDroppedElement, setSelectedNode } from "../../feautures/node/nodeSlice";
import { DragEvent } from "react";
import CreateNodeForm from "./CreateNodeForm";
import ContextMenu from "./ContextMenu";
import SidebarFooter from "./SidebarFooter";

export default function Sidebar() {
  const { motherNode, createNode, selectedNode,contextMenu } = useSelector(
    (state: RootState) => state.motherNode
  );
  const dispatch = useDispatch();
  const primaryNodes = motherNode.filter((node) => {
    return node.precursor === "main";
  });

  const makeElementStyles = (createNode.folder || createNode.file) && (selectedNode.toCreate === 'main')

  const ifContextMenu = contextMenu.show && contextMenu.selected

  function mainDrop(e: DragEvent<HTMLDivElement>){
    const elPath = e.dataTransfer.getData("app/drag");
      const elPrecursor = elPath.split("/").slice(0, -1).join("/");
      if (elPrecursor !== 'main') {
        (e.target as HTMLDivElement).style.backgroundColor = "";
        (e.target as HTMLDivElement).style.outline = "none";
        // @ts-ignore
        dispatch(moveDroppedElement({ dropElement: 'main', DragElement: elPath }));
      }
  }

  return (
    <section
      className={style.sidebar}
    >
      <SidebarHeader />
      {
        makeElementStyles ? <CreateNodeForm /> : undefined
      }
      <div className={style.node_system}>
      {
          ifContextMenu ? (
            <ContextMenu nodeElement={contextMenu.selected as folderNode | fileNode} />
            ) 
            : undefined
          }
        {primaryNodes.map((node) => {
          if (node.type === "folder")
            return (
              <FolderRenderer
                key={node.elementPath}
                folderNode={node as folderNode}
              />
            );
          return (
            <FileRenderer
              key={node.elementPath}
              fileNode={node as fileNode}
            />
          );
        })}
      </div>
      <div onDragOver={e => e.preventDefault()} onDrop={e => mainDrop(e)} onClick={() => dispatch(setSelectedNode('main'))} className={style.filler}></div>
      <SidebarFooter />
    </section>
  );
}
