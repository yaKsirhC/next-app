import React, { useEffect, useState } from "react";
import { keyMap } from "../d";


export default function useListenToKeyCombination(keyMap: keyMap, ref: React.MutableRefObject<HTMLElement>, cb: Function){
    const [didPressCombination, setDidPressCombination] = useState(false)

    function handleKeyChanges(e: KeyboardEvent){
        if(e.ctrlKey === keyMap.ctrl && e.shiftKey === keyMap.shift && e.key === keyMap.key){
            e.preventDefault()
            setDidPressCombination(true)
        }
    }

    useEffect(() => {
        if(didPressCombination){
            const promise = new Promise((resolve,reject) => {
                try {
                    cb()
                    resolve(true)
                } catch (error) {
                    reject(error)
                }
            })
            promise.then(() => {
                setDidPressCombination(false)
            })
            .catch(err => console.error(err))
        }
    }, [didPressCombination])

    useEffect(() => {
        ref.current.addEventListener('keydown', handleKeyChanges)
        return () => {
            console.log(ref.current);
            if(ref.current){
                ref.current.removeEventListener('keydown', handleKeyChanges)
            }
        }
    }, [])
    return didPressCombination
}