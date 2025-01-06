import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
import txnRouter from "./routes/txnRoute.js"
const app=express();
app.use(cors({origin:"*"}))
app.use(express.json({limit:"20mb"}));
app.use('/api/txn', txnRouter)
dotenv.config();
const db=process.env.MONGO_URI
mongoose.connect(db).then(()=>{
    console.log("Database connected")
}).catch(err=>{
    console.log("Error connecting to database", err)
})
const port=5000;
app.listen(port, ()=>{
    console.log("Server running on port", port)
})