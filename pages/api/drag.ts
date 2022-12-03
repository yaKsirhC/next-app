import { NextApiRequest, NextApiResponse } from "next";
import { fileNode, folderNode } from "../../d";
import comparePaths from "../../utils/comparePaths";
import updateFile from "../../utils/updateFile";
import motherNodeJSON from './motherNode.json'


export default function handler(req: NextApiRequest, res: NextApiResponse){
    if(req.method === 'PUT'){
        const dragEl = req.body.dragElement as ( fileNode | folderNode)
        const dropEl = typeof req.body.dropElement === 'string'  ? req.body.dropElement : req.body.dropElement.elementPath 
        
        if(dragEl.type === 'file'){
            const newPath = dropEl + '/' + dragEl.elementName

            const newElement = new fileNode(newPath, (dragEl as fileNode).text)
            // @ts-ignore
            motherNodeJSON.splice(motherNodeJSON.findIndex(e => e.elementPath === (dragEl as fileNode).elementPath), 1, newElement)

            updateFile(JSON.stringify(motherNodeJSON), process.env.JSON_DB_URI as string)

            return res.status(200).json(motherNodeJSON)
        }

        motherNodeJSON.forEach(el => {
            if(el.elementPath.startsWith(dragEl.elementPath)){
                const splitElPath = el.elementPath.split('/')
                const splitDragPathLength = dragEl.elementPath.split('/').length

                const modifiedElPath = splitElPath.slice(splitDragPathLength - 1).join('/')

                const newPath = dropEl + '/' + modifiedElPath
                const newPrecursor = newPath.split('/').slice(0,-1).join('/')
                el.elementPath = newPath
                el.precursor = newPrecursor
            }
            
        })
        updateFile(JSON.stringify(motherNodeJSON), process.env.JSON_DB_URI as string)
        return res.status(200).json(motherNodeJSON)
    }
}