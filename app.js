import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from "url";

const app = express();

//  important Middlewares func call ---> 

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
dotenv.config();


// Manually define __dirname (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// home Route--->
app.get('/',async(req,res)=>{
    try {
        return res.sendFile(path.join(__dirname, 'view', 'index.html'))
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    };
});




// 404 route or false route handle --->
app.use((req,res,next)=>{
    return res.status(404).json({
        success:false , 
        message:"Route is undifined"
    });
});


// server error catch up ---> 

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({
        success:false , 
        message:err.message || 'Internal server error'
    });
});


export default app ;