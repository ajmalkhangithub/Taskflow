import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { deleteTask, getTask, taskCreate, updateTask,getTaskById } from '../controllers/taskController.js'

const taskRouter=express.Router()

taskRouter.route('/gp')
.get(authMiddleware,getTask)
.post(authMiddleware,taskCreate)


taskRouter.route('/:id/gp')
.get(authMiddleware,getTaskById)
.put(authMiddleware,updateTask)
.delete(authMiddleware,deleteTask)


export default taskRouter;