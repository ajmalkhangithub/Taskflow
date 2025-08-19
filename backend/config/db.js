import mongoose from "mongoose";

export const connectDb= async ()=>{
    mongoose.connect("mongodb+srv://Ajmalkhan:J5Aq5p1PcpQrfLjR@cluster0.aqc6qrl.mongodb.net/Taskflow?retryWrites=true")
    .then(()=>{
        console.log("database is connected successfuly")
    })
    .catch((error)=>{
           console.log("Your database is not connected due to some reason",error)
    })
}