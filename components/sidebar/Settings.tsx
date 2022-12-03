import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setShowModal } from '../../feautures/node/settingsSlice'
import styles from '../../styles/Sidebar.module.scss'
import detectOutOfFocusComponent from '../../utils/detectOutOfFocusComponent'

export default function Settings(){
    const dispatch = useDispatch()
    const settingsWrapperRef = useRef() as React.MutableRefObject<HTMLDivElement>
    const settingsRef = useRef() as React.MutableRefObject<HTMLDivElement>

    function handleClick(e: MouseEvent){
        detectOutOfFocusComponent(e,settingsWrapperRef.current, () => {
            dispatch(setShowModal({modal: false}))
        })
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            settingsRef.current.style.transform = 'translateY(0)'
            window.addEventListener('click', handleClick)
        },0)
        return () => {
            window.removeEventListener('click', handleClick)
            clearTimeout(timeout)
        }
    },[])

    return (
        <div ref={settingsWrapperRef} className={styles.settings_wrapper}>
            <div ref={settingsRef} className={`${styles.settings}`}>
                {/* @ts-ignore */}
            <p onClick={() => dispatch(setShowModal({editor: true, modal: false}))} style={{'--clr': 'blue'}}>open settings on file editor</p>
            <p>Open Advanced Folder Structure</p>
            </div>
        </div>
    )
}

