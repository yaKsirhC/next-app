import fs from 'fs'
import { motherNode } from '../d';

export default async function updateMotherNodeJSON(newMotherNode: motherNode){
    const stringifiedCont = JSON.stringify(newMotherNode)
    fs.writeFile(process.env.JSON_DB_URI as string, stringifiedCont, (err) => {
        err && console.error(err);
    })
}