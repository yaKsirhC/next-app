import fs from 'fs'

export default async function updateFile(StringifiedData: string, path: string){
    fs.writeFile(path, StringifiedData, (err) => {
        err && console.error(err);
    })
}