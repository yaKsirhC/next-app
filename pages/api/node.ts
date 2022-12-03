// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import motherNodeJSON from './motherNode.json'
import type { NextApiRequest, NextApiResponse } from 'next'
import { motherNode, fileNode, folderNode } from '../../d'
import updateFile from '../../utils/updateFile';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{motherNode: motherNode} | Error >
) {
  if(req.method === 'GET') return res.status(200).json({ motherNode: motherNodeJSON })
  if(req.method === 'POST') {
    const newNode = req.body.node
    motherNodeJSON.push(newNode)
    await updateFile(JSON.stringify(motherNodeJSON),process.env.JSON_DB_URI as string)
    return res.status(200).send({motherNode: motherNodeJSON})
  }
  if(req.method === 'DELETE'){
    const deletedNodePath = req.query.node as string
    const nodeInd = motherNodeJSON.findIndex(node => {
      if(node.elementPath === deletedNodePath){
        return true
      }
    })
    // @ts-ignore 
    const secondaryNodes = motherNodeJSON.reduce((pre,cur) => {
      if(cur.precursor === deletedNodePath || cur.elementPath === deletedNodePath) return [...pre]
      return [...pre,cur]
    },[]) as unknown as motherNode
    if(nodeInd < 0) return res.status(404).send(new Error('node not found'))
    updateFile(JSON.stringify(secondaryNodes),process.env.JSON_DB_URI as string)
    res.status(200).send({motherNode: secondaryNodes })
  }
  if(req.method === 'PUT'){
    const newNode = req.body.newNode as (folderNode | fileNode)
    const oldNode = req.body.oldNode as (folderNode | fileNode)
    const oldNodeInd = motherNodeJSON.findIndex(node => {
      return node.elementPath === oldNode.elementPath
    })

    if(oldNode.type === 'folder'){
      motherNodeJSON.forEach(node => {
        if(node.precursor === oldNode.elementPath){
          node.precursor = newNode.elementPath
          node.elementPath = newNode.elementPath + '/' + node.elementName
        }
      })
    }
    // @ts-ignore
    motherNodeJSON.splice(oldNodeInd, 1, newNode)
    await updateFile(JSON.stringify(motherNodeJSON),process.env.JSON_DB_URI as string)
    return res.status(200).send({motherNode: motherNodeJSON})
  }
}