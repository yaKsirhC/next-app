import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateSettings } from "../../feautures/node/settingsSlice";
import styles from "../../styles/Settings.module.scss";

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
    dispatch(updateSettings({schemeChange: { [clrTitle]: colorValue }}));
  }

  return (
    <div className={styles.color_display}>
      <div className={styles.title}><span>{clrTitle}</span></div>
      <input onBlur={(e) => decideBlur(e)} className={styles.color_block} type="color" onChange={(e) => setColorValue(e.target.value)} value={colorValue} id="colorPicker"></input>
      <input onBlur={(e) => decideBlur(e)} type="text" onChange={(e) => setColorValue(e.target.value)} value={colorValue} />
    </div>
  );
}
