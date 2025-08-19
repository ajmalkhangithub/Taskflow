import express from 'express'
import { connectDb } from './config/db.js';
import cors from 'cors'
import dotenv from 'dotenv'
import userRouter from './routes/userRoute.js'
import taskRouter from './routes/taskRoute.js';
const app=express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended:true }))



const port=process.env.PORT || 3000;
//DB connect
connectDb()

//Routes
app.use('/api/v1',userRouter)
app.use('/api/task',taskRouter)
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})