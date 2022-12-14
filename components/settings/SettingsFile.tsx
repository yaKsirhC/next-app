import { useDispatch } from 'react-redux'
import { setShowModal } from '../../feautures/node/settingsSlice'
import styles from '../../styles/Settings.module.scss'
import ColorPallete from './ColorPallete'
import FontSettings from './FontSettings'

export default function SettingsFile(){

    const dispatch = useDispatch()

    return(
        <div className={styles.settings}>
            <div onClick={() => dispatch(setShowModal({editor: false}))} className={styles.close_settings}>
                X
            </div>
            <div className={styles.color}>
                <ColorPallete />
            </div>
            <div className={styles.font_settings}>
                <FontSettings />
            </div>

            <p className={styles.info}>
                * Settings are automaticaly saved to server.
            </p>
        </div>
    )
}