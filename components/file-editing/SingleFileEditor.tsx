import axios from "axios";
import { useRef, useState, useLayoutEffect, CSSProperties, FormEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { keyMap, motherNode } from "../../d";
import { fakeUpdateText } from "../../feautures/node/nodeSlice";
import { updateNodeSystem } from "../../feautures/node/nodeSlice";
import { RootState } from "../../feautures/store";
import useListenToKeyCombination from "../../hooks/useListenToKeyCombination";
import styles from "../../styles/FileEditors.module.scss";
import LiveHTML from "./LiveHTML";

export default function SingleFileEditor() {
  const { openFile } = useSelector((state: RootState) => state.motherNode);
  const dispatch = useDispatch();
  const divRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const textRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>;
  const [fileText, setFileText] = useState(openFile?.text);
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
        elementPath: openFile?.elementPath,
        text: fileText,
      }
    );
    dispatch(fakeUpdateText(fileText));
    dispatch(updateNodeSystem(resp.data.motherNode));
  }

  const didPressSave = useListenToKeyCombination(
    keyMapSave,
    divRef,
    submitChanges
  );

  useLayoutEffect(() => {
    setFileText(openFile?.text);
  }, [openFile?.text]);

  const arePendingChanges = !(fileText === openFile?.text);

  const fileParts = openFile?.elementPath.split("/");
  const fileExt = openFile?.fileName?.split('.').slice(-1)[0]  

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
        <textarea
        ref={textRef}
          onChange={(e) => {
            setFileText(e.target.value)
          }}
          value={fileText}
        />
      </div>
      {/* {
        fileExt === 'html' && hotHTML ? (
            <LiveHTML />
        )
        :
        undefined
      } */}
    </>
  );
}
