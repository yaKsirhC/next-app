import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateColorScheme } from "../../feautures/node/settingsSlice";
import styles from "../../styles/Settings.module.scss";
import detectOutOfFocusComponent from "../../utils/detectOutOfFocusComponent";

export default function ColorDisplay({ clrArr }: { clrArr: [string, string] }) {
  const clrTitle = clrArr[0];
  const clrCode = clrArr[1];
  const [colorValue, setColorValue] = useState(clrCode)
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const dispatch = useDispatch()
  function changeColor() {
    // @ts-ignore
    dispatch(updateColorScheme({[clrTitle]: colorValue}))
  }
    function detectInput(e: MouseEvent) {
        detectOutOfFocusComponent(e, inputRef.current, changeColor)
    } 

  return (
    <div className={styles.color_display}>
      <div className={styles.title}>{clrTitle}</div>
      <div className={styles.color_block} style={{backgroundColor: clrCode}}></div>
      <input onBlur={e => changeColor()} ref={inputRef} type="text" onChange={e => setColorValue(e.target.value)} value={colorValue} />
    </div>
  );
}
