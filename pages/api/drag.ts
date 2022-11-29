import { NextApiRequest, NextApiResponse } from "next";
import { fileNode, folderNode } from "../../d";
import motherNodeJSON from './motherNode.json'

export default function handler(req: NextApiRequest, res: NextApiResponse){
    if(req.method === 'PUT'){
        const dragEl = req.body.dragEl as ( fileNode | folderNode)
        const dropEl = req.body.dropEl as folderNode
        if(dragEl.type === 'folder'){
            motherNodeJSON.forEach(node => {
                if(node.precursor.includes(dragEl.elementPath)){
                    const test = node.elementPath.split('/')
                    const split = dragEl.elementPath.split('/')
                    // @ts-ignore
                    const red = test.reduce((pre, curr, i) => {
                        if(curr === split[i]){
                            return [...pre]
                        }
                        return [...pre,curr]
                    }, [])
                    console.log(red);
                    // const newNodePath = dropEl.elementPath + '/' + node.elementName
                    // const relocatedNode = node.type === 'file' ? new fileNode(,node.text)
                    res.status(200).json({motherNode: motherNodeJSON})
                }
            })
        }
    }
}