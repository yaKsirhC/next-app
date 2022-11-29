import { useSelector, useDispatch } from "react-redux";
import { fileNode } from "../../d";
import { closeFile, setOpenFile } from "../../feautures/node/editorSlice";
import { RootState } from "../../feautures/store";
import styles from "../../styles/FileEditors.module.scss";

export default function FileEditorHeadTab({ file }: { file: fileNode }) {
  const { openFile } = useSelector((state: RootState) => state.editor);
  const dispatch = useDispatch();

  return (
    <div className={`${file.elementPath === openFile?.elementPath ? styles.highlight : ""} ${styles.tab}`}>
      <h5 onClick={() => dispatch(setOpenFile(file))} className={styles.h5}>
        {file.elementName}
      </h5>
      <span onClick={() => dispatch(closeFile(file))}>X</span>
    </div>
  );
}
