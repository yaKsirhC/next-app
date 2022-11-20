import { useSelector } from 'react-redux';
import { RootState } from '../../feautures/store';
import styles from '../../styles/FileEditors.module.scss'
import SingleFileEditor from "./SingleFileEditor";

export default function FileEditors() {
  const {openFile} = useSelector((state:RootState) => state.editor)

  return (
    <section className={styles.file_editor}>
        {
        openFile?.elementPath ? (
          <SingleFileEditor />
        )
        :
        undefined
      }
    </section>
  );
}
