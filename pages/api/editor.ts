import motherNodeJSON from './motherNode.json'
import type { NextApiRequest, NextApiResponse } from 'next'
import { motherNode, fileNode, folderNode } from '../../d'
import updateMotherNodeJSON from '../../utils/updateMotherNodeJSON';

export default function handler(req: NextApiRequest, res: NextApiResponse<{motherNode: motherNode}>){
    console.log('updating');
    if(req.method === 'PUT'){
        const fileContents = req.body.text
        const file = req.body.elementPath

        const ind = motherNodeJSON.findIndex(node => {
            return node.elementPath === file
        })
        const newNode = {...motherNodeJSON[ind], text: fileContents}
        motherNodeJSON.splice(ind, 1, newNode)
        updateMotherNodeJSON(motherNodeJSON)
        console.log(fileContents);
        return res.status(200).json({motherNode: motherNodeJSON})
    }
}