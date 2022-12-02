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
  contextMenu: {
    show: boolean;
    selected: fileNode | folderNode | null;
    toRename: boolean;
    cords: {
      top: string;
      left: string;
    };
  };
  openFile: string | null;
  tabFiles: string[];
}

export interface keyMap {
  ctrl: boolean;
  shift: boolean;
  key: string;
}

export interface settingsState {
  show: {
    modal: boolean;
    editor: boolean;
  };
  settings: {
    _v: number;
    clr_pallete: clr_pallete;
    fnt: {
      family: string;
    };
  };
}

export interface clr_pallete {
  beige_1: string;
  beige_2: string;
  beige_3: string;
  gray_2: string;
  hover_clr: string;
  red_1: string;
  red_2: string;
  red_3: string;
}
