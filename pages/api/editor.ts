import motherNodeJSON from './motherNode.json'
import type { NextApiRequest, NextApiResponse } from 'next'
import { motherNode, fileNode, folderNode } from '../../d'
import updateFile from '../../utils/updateFile';

export default function handler(req: NextApiRequest, res: NextApiResponse<{motherNode: motherNode}>){
    if(req.method === 'PUT'){
        const fileContents = req.body.text
        const file = req.body.elementPath
        console.log(fileContents);

        const ind = motherNodeJSON.findIndex(node => {
            return node.elementPath === file
        })
        const newNode = {...motherNodeJSON[ind], text: fileContents}
        motherNodeJSON.splice(ind, 1, newNode)
        updateFile(JSON.stringify(motherNodeJSON), process.env.JSON_DB_URI as string)
        return res.status(200).json({motherNode: motherNodeJSON})
    }
}