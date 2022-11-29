import { NextApiRequest, NextApiResponse } from "next";
import mysql from 'mysql'

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'YOURPASSWORD',
    database: 'file_editor_DB'
})

db.connect(err => {
    if(err){
        console.error(err);
    }
})

export default function handler(req: NextApiRequest, res: NextApiResponse){
    if(req.method === 'PUT'){
        // const scheme = 
        res.status(200).send({})
    }
}