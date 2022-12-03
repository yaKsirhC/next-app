import { useRef, useState, useLayoutEffect, CSSProperties, FormEvent, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fileNode, keyMap } from "../../d";
import { submitTextChange } from "../../feautures/node/nodeSlice";
import { RootState } from "../../feautures/store";
import useListenToKeyCombination from "../../hooks/useListenToKeyCombination";
import styles from "../../styles/FileEditors.module.scss";
import CodeMirror from '@uiw/react-codemirror'
import { bbedit } from '@uiw/codemirror-theme-bbedit';


export default function SingleFileEditor() {
  const { openFile,motherNode } = useSelector((state: RootState) => state.motherNode);
  const dispatch = useDispatch();
  const openFileNode = motherNode.find(el => el.elementPath === openFile) as fileNode
  const divRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [fileText, setFileText] = useState(openFileNode?.text);
  const keyMapSave: keyMap = {
    ctrl: true,
    shift: false,
    key: "s",
  };
  const keyMapTab: keyMap = {
    ctrl: false,
    shift: false,
    key: "Tab",
  };
  
  const didPressSave = useListenToKeyCombination(
    keyMapSave,
    divRef,
    // @ts-ignore
    () => dispatch(submitTextChange(fileText))
  );

  useEffect(() => {
  },[openFileNode?.text])

  useLayoutEffect(() => {
    setFileText(openFileNode?.text);
  }, [openFileNode?.text]);

  const arePendingChanges = !(fileText === openFileNode?.text);

  const fileParts = openFileNode?.elementPath.split("/");
  const fileExt = openFileNode?.fileName?.split('.').slice(-1)[0]  

  return (
    <>
      <div className={styles.single_editor_wrapper} ref={divRef} id="editor">
        <div className={styles.navigation_file}>
          {fileParts?.map((part, ind) => {
            return (
              <>
                <span key={ind} className={styles.nav_p}>
                  {part}
                </span>
                {ind + 1 <= fileParts.length - 1 ? <div>&gt;</div> : undefined}
              </>
            );
          })}
          {arePendingChanges ? (
            <div className={styles.nav_dot}></div>
          ) : undefined}
        </div>
        <CodeMirror 
        theme={bbedit}
          value={fileText}
          readOnly={false}
          onChange={e => setFileText(e)}
        />
      </div>
    </>
  );
}
