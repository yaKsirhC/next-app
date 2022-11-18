import styles from '../../styles/Sidebar.module.scss'
import { folderNode, fileNode } from "../../d";
import FileRenderer from "./FileRenderer";
import FolderRenderer from "./FolderRenderer";

export default function ChildrenNodeMap({
  children,
  higherIndex = 0,
}: {
  children: (folderNode | fileNode)[];
  higherIndex?: number;
}) {
  return (
    <div className={styles.node_children}>
      {children.map((node) => {
        if (node.type === "folder")
          return (
            <FolderRenderer
              higherIndex={higherIndex + 1}
              key={(node as folderNode).folderPath}
              folderNode={node as folderNode}
            />
          );
        return (
          <FileRenderer
            higherIndex={higherIndex + 1}
            key={(node as fileNode).filePath}
            fileNode={node as fileNode}
          />
        );
      })}
    </div>
  );
}
