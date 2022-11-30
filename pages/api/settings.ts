import { NextApiRequest, NextApiResponse } from "next";
import updateFile from "../../utils/updateFile";
import settingsFile from '../api/settingsFile.json'

export default function handler(req: NextApiRequest, res: NextApiResponse){
    try {
        if(req.method === 'GET'){
            return res.status(200).send(settingsFile)
        }
        if(req.method === 'PUT'){
            const scheme = req.body.scheme
            const font = req.body.font
            if(scheme){
                console.log(settingsFile);
                settingsFile.settings.clr_pallete = scheme
            }
            if(font){
                console.log(font)
                settingsFile.settings.fnt = font
            }
            settingsFile.settings._v++
            console.log(settingsFile);
            updateFile(JSON.stringify(settingsFile),process.env.SETTINGS_FILE_URI as string )
            return res.status(200).json(settingsFile)
            
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}