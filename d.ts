export class fileNode {
  filePath: string;
  text: string;
  fileName: string;
  type: string = "file";
  precursor: string;

  constructor(filePath: string, text: string) {
    this.filePath = filePath;
    this.text = text;
    this.fileName = filePath.split("/").slice(-1)[0];

    const precursor = filePath.split("/");
    precursor.pop();

    this.precursor = precursor.join("/");
  }
}

export class folderNode {
  folderPath: string;
  folderName: string;
  type: string = "folder";
  precursor: string;

  constructor(folderPath: string) {
    this.folderName = folderPath.split("/").slice(-1)[0];
    this.folderPath = folderPath;
    const precursor = folderPath.split("/");
    precursor.pop();

    this.precursor = precursor.join("/");
  }
}

export type motherNode = (folderNode | fileNode)[];


export interface createNode {
  file: boolean,
  folder: boolean
}
export interface nodeState {
  motherNode: motherNode,
  selectedNode: {
    toCreate: folderNode,
    toSelect: fileNode | folderNode
  },
  createNode: createNode,
  openFiles: fileNode[],
  contextMenu: {show: boolean, selected: (fileNode | folderNode | null)}
}