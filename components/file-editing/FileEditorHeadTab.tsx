import { CSSProperties } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fileNode } from "../../d";
import { closeFile, setOpenFile, setSelectedNode } from "../../feautures/node/nodeSlice";
import { RootState } from "../../feautures/store";
import styles from "../../styles/FileEditors.module.scss";

export default function FileEditorHeadTab({ file }: { file: fileNode }) {
  const { openFile } = useSelector((state: RootState) => state.motherNode);
  const dispatch = useDispatch();

  const isHighLighted: CSSProperties = {
    backgroundColor: openFile === file.elementPath ? 'var(--red_3)' : ''
  }

  function handleSwitchFileAct(){
    dispatch(setOpenFile(file.elementPath))
    dispatch(setSelectedNode({toSelect: file.elementPath, toCreate: file.precursor}))
  }

  return (
    <div style={isHighLighted} className={styles.tab}>
      <h5 onClick={() =>handleSwitchFileAct()} className={styles.h5}>
        {file.elementName}
      </h5>
      <span onClick={() => dispatch(closeFile(file))}>X</span>
    </div>
  );
}
