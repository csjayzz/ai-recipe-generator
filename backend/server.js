import dotenv from 'dotenv'
dotenv.config(); // this make everything in our env file through process.env

import express from 'express';
import cors from 'cors';

const app = express();

//Middleware
//this allows our frontend to communicate with our backend without cross origin issues
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get('/',(req,res)=>{
    res.json({message : 'AI Recipe Generator API'});
});

const PORT = process.env.PORT || 8000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
