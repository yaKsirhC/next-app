import style from "../../styles/Sidebar.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fileNode, folderNode, motherNode } from "../../d";
import { RootState } from "../../feautures/store";
import FileRenderer from "./FileRenderer";
import FolderRenderer from "./FolderRenderer";
import SidebarHeader from "./SideBarHeader";
import { setSelectedNode } from "../../feautures/node/nodeSlice";
import { CSSProperties } from "react";
import CreateNodeForm from "./CreateNodeForm";

export default function Sidebar() {
  const { motherNode, createNode, selectedNode } = useSelector(
    (state: RootState) => state.motherNode
  );
  const dispatch = useDispatch();
  const primaryNodes = motherNode.filter((node) => {
    return node.precursor === "main";
  });

  const makeElementStyles = (createNode.folder || createNode.file) && ((selectedNode as folderNode).folderPath === 'main')


  return (
    <section
      className={style.sidebar}
    >
      <SidebarHeader />
      {
        makeElementStyles ? <CreateNodeForm /> : undefined
      }
      <div className={style.folder_structure}></div>
      <div className={style.node_system}>
        {primaryNodes.map((node) => {
          if (node.type === "folder")
            return (
              <FolderRenderer
                key={(node as folderNode).folderPath}
                folderNode={node as folderNode}
              />
            );
          return (
            <FileRenderer
              key={(node as fileNode).filePath}
              fileNode={node as fileNode}
            />
          );
        })}
      </div>
      <div onClick={() => dispatch(setSelectedNode('main'))} className={style.filler}></div>
    </section>
  );
}
