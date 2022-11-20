export class fileNode {
  filePath?: string;
  text: string;
  fileName?: string;
  type: string = "file";
  precursor: string;
  elementName: string;
  elementPath: string;

  constructor(filePath: string, text: string) {
    this.filePath = filePath;
    this.text = text;
    this.fileName = filePath.split("/").slice(-1)[0];
    this.elementName = this.fileName;
    this.elementPath = this.filePath;

    const precursor = filePath.split("/");
    precursor.pop();

    this.precursor = precursor.join("/");
  }
}

export class folderNode {
  folderPath?: string;
  folderName?: string;
  type: string = "folder";
  precursor: string;
  elementName: string;
  elementPath: string;

  constructor(folderPath: string) {
    this.folderName = folderPath.split("/").slice(-1)[0];
    this.folderPath = folderPath;
    this.elementName = this.folderName;
    this.elementPath = this.folderPath;

    const precursor = folderPath.split("/");
    precursor.pop();

    this.precursor = precursor.join("/");
  }
}

export type motherNode = (folderNode | fileNode)[];

export interface createNode {
  file: boolean;
  folder: boolean;
}
export interface nodeState {
  motherNode: motherNode;
  selectedNode: {
    toCreate: folderNode;
    toSelect: fileNode | folderNode;
  };
  createNode: createNode;
  openFiles: fileNode[];
  contextMenu: {
    show: boolean;
    selected: fileNode | folderNode | null;
    toRename: boolean;
    cords: {
      top: string;
      left: string
    }
  };
}

export interface editorState {
  openFile: fileNode | null;
  tabFiles: fileNode[];
  hotHTML: boolean;
}

export interface keyMap {
  ctrl: boolean;
  shift: boolean;
  key: string;
}
