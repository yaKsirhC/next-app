// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { motherNode, fileNode, folderNode } from '../../d'


const motherNode: motherNode = [
  new fileNode('main/index.txt', 'hello world'),
  new folderNode('main/folder1'),
  new folderNode('main/folder1/folder2'),
  new fileNode('main/folder1/folder2/index.txt', 'nothing to see')
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{motherNode: motherNode}>
) {
  res.status(200).json({ motherNode })
}
