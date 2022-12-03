import { CSSProperties, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fileNode, folderNode } from '../../d';
import { deleteElement, setSelectedNode, setShowContextMenu, updateNodeSystem } from '../../feautures/node/nodeSlice';
import { RootState } from '../../feautures/store';
import styles from '../../styles/Sidebar.module.scss'

export default function ContextMenu({nodeElement}: {nodeElement: (fileNode | folderNode)}) {
    const svgRef = useRef() as React.MutableRefObject<any>;
    const contextmenu = useRef() as React.MutableRefObject<HTMLDivElement>;
    const [copyStyles, setCopyStyles] = useState<CSSProperties>({
      opacity: 0
    })
    const {contextMenu}  = useSelector((state: RootState) => state.motherNode)
    const dispatch = useDispatch()

    function windowEvent(e: MouseEvent){
      const el = e.target as HTMLElement
        if(el != contextmenu.current && (el as HTMLElement)?.parentElement?.parentElement != contextmenu.current && (el as HTMLElement)?.parentElement != contextmenu.current  ){
          dispatch(setShowContextMenu({show: false, selected: null, toRename: false}))
      
          }
    }

    useEffect(() => {

      window.addEventListener('click',windowEvent)

        svgRef.current.addEventListener('click', () => {
          setCopyStyles({opacity: 1})
          navigator.clipboard.writeText(nodeElement.elementPath)
          setTimeout(() => {
            setCopyStyles({opacity: 0})
    
        }, 2000)
      })

        return () => window.removeEventListener('click', windowEvent)
    },[])

    const onClickFns = {
      rename: () => {
        dispatch(setShowContextMenu({show: false, toRename: true, selected: contextMenu.selected}))

      },
      // @ts-ignore
      delete: () => dispatch(deleteElement(nodeElement.elementPath)),

    }
  return (
    <div ref={contextmenu} style={{top: contextMenu.cords.top, left: contextMenu.cords.left}} className={styles.context_menu_wrapper}>
      <div onClick={() => onClickFns.rename()} className={`${styles.option} ${styles.rename}`}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.8075 4.35L12.9 3.4425C12.315 2.8575 11.3625 2.8575 10.7775 3.4425L8.7675 5.4525L2.25 11.97V15H5.28L11.835 8.445L13.8075 6.4725C14.4 5.8875 14.4 4.935 13.8075 4.35V4.35ZM4.6575 13.5H3.75V12.5925L10.245 6.0975L11.1525 7.005L4.6575 13.5ZM8.25 15L11.25 12H15.75V15H8.25Z"
            fill="black"
          />
        </svg>
        <span>Rename</span>
      </div>
      <div onClick={() => onClickFns.delete()} className={`${styles.option} ${styles.delete}`}>
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.1409 6.40002L10.3864 10M10.3864 10L6.63184 13.6M10.3864 10L6.63184 6.40002M10.3864 10L14.1409 13.6"
            stroke="#FF0000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.3863 19C15.5703 19 19.7727 14.9706 19.7727 10C19.7727 5.02944 15.5703 1 10.3863 1C5.2024 1 1 5.02944 1 10C1 14.9706 5.2024 19 10.3863 19Z"
            stroke="#FF0000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Delete</span>
      </div>
      <div className={styles.path_options}>
        <p>main/folder1gggggggggggggggggggggggggg</p>
        <svg
        ref={svgRef}
          className="clipboard"
          width="18"
          height="16"
          viewBox="0 0 18 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.4129 0.666656H2.85322C2.06858 0.666656 1.42661 1.26666 1.42661 1.99999V11.3333H2.85322V1.99999H11.4129V0.666656ZM13.5528 3.33332H5.70645C4.92182 3.33332 4.27984 3.93332 4.27984 4.66666V14C4.27984 14.7333 4.92182 15.3333 5.70645 15.3333H13.5528C14.3375 15.3333 14.9795 14.7333 14.9795 14V4.66666C14.9795 3.93332 14.3375 3.33332 13.5528 3.33332ZM13.5528 14H5.70645V4.66666H13.5528V14Z"
            fill="black"
          />
        </svg>
        <span className={`${styles.clipboard_text}`} style={copyStyles}>Copied path!</span>
      </div>
    </div>
  );
}
