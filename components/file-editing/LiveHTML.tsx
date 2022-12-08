import {  useRef } from "react";
import styles from '../../styles/FileEditors.module.scss'

export default function LiveHTML(){
    const live = useRef() as React.MutableRefObject<HTMLDivElement>

    
    // useEffect(() => {
    //     live.current && (live.current.innerHTML = openFile?.text as string)
    // }, [openFile?.text])

    return (
        <div className={styles.live_HTML_container} >
            <div className={styles.hot_HTML} ref={live}>

            </div>
        </div>
    )
}