import style from "../../styles/Sidebar.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fileNode, folderNode, motherNode } from "../../d";
import { RootState } from "../../feautures/store";
import FileRenderer from "./FileRenderer";
import FolderRenderer from "./FolderRenderer";
import SidebarHeader from "./SideBarHeader";
import { setSelectedNode } from "../../feautures/node/nodeSlice";
import { CSSProperties, useState } from "react";
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

  const makeElementStyles = (createNode.folder || createNode.file) && (selectedNode.toCreate.elementPath === 'main')

  const ifContextMenu = contextMenu.show && contextMenu.selected

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
      <div onClick={() => dispatch(setSelectedNode('main'))} className={style.filler}></div>
      <SidebarFooter />
    </section>
  );
}
