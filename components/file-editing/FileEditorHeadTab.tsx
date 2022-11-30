import { CSSProperties } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fileNode } from "../../d";
import { closeFile, setOpenFile } from "../../feautures/node/nodeSlice";
import { RootState } from "../../feautures/store";
import styles from "../../styles/FileEditors.module.scss";

export default function FileEditorHeadTab({ file }: { file: fileNode }) {
  const { openFile } = useSelector((state: RootState) => state.motherNode);
  const dispatch = useDispatch();

  const isHighLighted: CSSProperties = {
    backgroundColor: openFile?.elementPath === file.elementPath ? 'var(--red-3)' : ''
  }

  return (
    <div style={isHighLighted} className={styles.tab}>
      <h5 onClick={() => dispatch(setOpenFile(file))} className={styles.h5}>
        {file.elementName}
      </h5>
      <span onClick={() => dispatch(closeFile(file))}>X</span>
    </div>
  );
}
