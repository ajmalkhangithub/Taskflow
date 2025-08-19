import Task from "../models/taskModel.js";

export const taskCreate=async (req,res)=>{
    try {
        const {title,description,priority,dueDate,completed }=req.body;
        
        const task=new Task({
           title,
           description,
           priority,
           dueDate,
           completed: completed=='Yes' || completed==true,
           owner:req.user.id 
        })
        const saved=await task.save()
        res.status(201).json({ success:true,task:saved})
    } catch (error) {
        res.status(400).json({ success:false,msg:"Something went wrong"})
    }
}



// GET ALL TASK FOR LOGGED - IN USER

export const getTask=async (req,res)=>{
try {
    const tasks= await Task.find({ owner:req.user.id}).sort({ createdAt:-1});
    res.json({ success:true, tasks})
} catch (error) {
      res.status(400).json({ success:false,msg:"Something went wrong"})
}
}


export const getTaskById=async (req,res)=>{
   try {
    const task= await Task.findOne({ _id:req.params.id,owner:req.user.id})
    if(!task){
        res.status(400).json({success:false,msg:"User not found"})
    }
    res.json({ success:true,task})
   } catch (error) {
       res.status(400).json({ success:false,msg:"Something went wrong"})
   }
}


//update the task 
export const updateTask= async (req,res)=>{

    try {
        const data={...req.body};
if(data.completed != undefined ){
    data.completed = data.completed === 'Yes' || data.completed === true
}
  const updated= await Task.findOneAndUpdate({
    _id:req.params.id,owner:req.user.id
  },
  data,
{new:true,runValidator:true}

)
if(!updated){
    res.status(400).json({success:true,msg:"Task not found or not Your"})
}
   res.json({success:true,task:updated})     
    } catch (error) {
         res.status(400).json({ success:false,msg:"Something went wrong"})

    }

}

//DELETE A TASK
export const deleteTask= async(req,res)=>{
try {
    const deleted=await Task.findOneAndDelete({_id:req.params.id,owner:req.user.id})
    if(!deleted) return res.status(404).json({success:false,msg:"Task not found or not Yours"});
    res.json({success:true,msg:"Task deleted successfully"})
} catch (error) {
     res.status(400).json({ success:false,msg:"Something went wrong"})
}
}