import React, { CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateColorScheme } from "../../feautures/node/settingsSlice";
import styles from "../../styles/Settings.module.scss";
import detectOutOfFocusComponent from "../../utils/detectOutOfFocusComponent";

export default function ColorDisplay({ clrArr }: { clrArr: [string, string] }) {
  const clrTitle = clrArr[0];
  const clrCode = clrArr[1];
  const [colorValue, setColorValue] = useState(clrCode);
  const dispatch = useDispatch();

  function decideBlur(e: React.FocusEvent) {
    const el = e.target as HTMLInputElement;
    if (el.value === clrCode) {
      return;
    }
    // @ts-ignore
    dispatch(updateColorScheme({ [clrTitle]: colorValue }));
  }

  return (
    <div className={styles.color_display}>
      <div className={styles.title}>{clrTitle}</div>
      <input className={styles.color_block} type="color" value={clrCode} id="colorPicker"></input>
      <input onBlur={(e) => decideBlur(e)} type="text" onChange={(e) => setColorValue(e.target.value)} value={colorValue} />
    </div>
  );
}
