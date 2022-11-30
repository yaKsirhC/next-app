import fs from 'fs'
import { motherNode } from '../d';

export default async function updateFile(StringifiedData: string, path: string){
    fs.writeFile(path, StringifiedData, (err) => {
        err && console.error(err);
    })
}