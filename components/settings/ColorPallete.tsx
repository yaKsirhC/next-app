import { useSelector } from 'react-redux'
import { RootState } from '../../feautures/store'
import styles from '../../styles/Settings.module.scss'
import ColorDisplay from './ColorDisplay'


export default function ColorPallete(){
    const {settings} = useSelector((state: RootState) => state.settings)
    const clrArr = Object.entries(settings.clr_pallete)


    return (
        <div className={styles.color_pallete}>
            {
                clrArr.map((indClrArr, i) => {
                    return <ColorDisplay clrArr={indClrArr} key={i} />
                })
            }
        </div>
    )
}