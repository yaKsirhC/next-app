import { useSelector } from "react-redux";
import { RootState } from "../../feautures/store";
import styles from "../../styles/FileEditors.module.scss";
import FileEditorHead from "./FileEditorHead";
import SingleFileEditor from "./SingleFileEditor";

export default function FileEditors() {
  const { openFile } = useSelector((state: RootState) => state.motherNode);

  return (
    <section className={styles.file_editor}>
      {openFile ? (
        <>
          <FileEditorHead />
          <SingleFileEditor />
        </>
      ) : undefined}
    </section>
  );
}
