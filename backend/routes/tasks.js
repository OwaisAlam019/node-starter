const express = require("express");
const User = require("../models/user");
const Tasks=require("../models/tasks");
const router = express.Router();

router.get("/",(req,res,nect) => {
    res.send("Inside Tasks");
});

router.post("/add",(req,res,nect) => {
    const task = new Tasks({
        title:req.body.title,
        description:req.body.description,
        userId:req.body.userId    
        }); 
    task.save(task).then(result => {
        res.status(200).json({
            message:"Task created"
        });
    }).catch(err=>{
        res.status(500).json({
            message:"could not add task"
        })
    })
})

router.post("/update",(req,res,nect) => {
    Tasks.findById({id:req.body.taskId},(err,task) => {
        task.title = req.body.title;
        task.description = req.body.description;
        task.save(task).then(result => {
            res.status(200).json({
                message:"Task updated"
            });
        })
    })
    .catch(err=>{
        res.status(500).json({
            message:"could not add task"
        })
    })
})

module.exports = router;
