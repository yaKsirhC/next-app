import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { updateSettings } from "../../feautures/node/settingsSlice"
import { RootState } from "../../feautures/store";

export default function FontSettings() {
    const dispatch = useDispatch()
    const {settings} = useSelector((state: RootState) => state.settings)
    const [option, setOption] = useState(settings.fnt.family)

    useEffect(() => {
        // @ts-ignore
        dispatch(updateSettings({fontSettings: {family: option}}))
    },[option])
  return (
    <select value={option} onChange={e => setOption(e.target.value)}>
        <option value="Poppins">Poppins</option>
        <option value="sans-serif">sans-serif</option>
        <option value="Roboto">Roboto</option>
        <option value="Inter">Inter</option>
        <option value="Lato">Lato</option>
        <option value="Montserrat">Montserrat</option>
        <option value="Noto Sans Display">Noto Sans Display</option>
        <option value="Open Sans">Open Sans</option>
        <option value="Dancing Script">Dancing Script</option>
        <option value="Raleway">Raleway</option>
        <option value="Ubuntu">Ubuntu</option>
    </select>
  );
}
