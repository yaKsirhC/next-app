export class fileNode{
    filePath: string;
    text: string;
    fileName: string;

    constructor(filePath: string, text: string){
        this.filePath = filePath
        this.text = text
        this.fileName = filePath.split('/').slice(-1)[0]
    }

}

export class folderNode{
    filePath: string;
    fileName: string;

    constructor(filePath: string){
        this.fileName = filePath.split('/').slice(-1)[0]
        this.filePath = filePath
    }
}

export type motherNode = (folderNode| fileNode)[]