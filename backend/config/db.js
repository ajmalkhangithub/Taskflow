import mongoose from "mongoose";

export const connectDb= async ()=>{
    mongoose.connect("")
    .then(()=>{
        console.log("database is connected successfuly")
    })
    .catch((error)=>{
           console.log("Your database is not connected due to some reason",error)
    })
}
