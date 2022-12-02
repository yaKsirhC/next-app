import axios from "axios";
import { useRef, useState, useLayoutEffect, CSSProperties, FormEvent, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fileNode, keyMap, motherNode } from "../../d";
import { fakeUpdateText } from "../../feautures/node/nodeSlice";
import { updateNodeSystem } from "../../feautures/node/nodeSlice";
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

  async function submitChanges() {
    console.log(fileText);
    const resp = await axios.put<{ motherNode: motherNode }>(
      process.env.NEXT_PUBLIC_API_URL + "editor",
      {
        elementPath: openFileNode?.elementPath,
        text: fileText,
      }
    );
    console.log(resp.data);

    dispatch(fakeUpdateText(fileText));
    dispatch(updateNodeSystem(resp.data.motherNode));
  }
  
  const didPressSave = useListenToKeyCombination(
    keyMapSave,
    divRef,
    submitChanges
  );

  useEffect(() => {
    // console.log(openFileNode?.text);
  },[openFileNode?.text])

  useLayoutEffect(() => {
    console.log(openFileNode)
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
