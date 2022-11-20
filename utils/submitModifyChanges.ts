import axios from "axios";
import Router from "next/router";
import { FocusEvent } from "react";
import { fileNode, folderNode } from "../d";

export default async function submitModifyNode(
  e: FocusEvent<HTMLInputElement, Element>,
  prevNode: fileNode | folderNode,
  setToRenameNode: Function
) {
  setToRenameNode(false);
  const inputValue = e.target.value;
  try {
    const prevPath = prevNode.elementPath.split("/");
    prevPath.splice(-1, 1, inputValue);
    const newNodePath = prevPath.join("/");
    const newNode =
      prevNode.type === "folder"
        ? new fileNode(newNodePath, "")
        : new folderNode(newNodePath);

    await axios.put(
      (process.env.NEXT_PUBLIC_API_URL as string) + "/node",
      { newNode: { ...newNode }, oldNode: fileNode }
    );
    Router.reload();
  } catch (error) {
    console.error(error);
  }
}
