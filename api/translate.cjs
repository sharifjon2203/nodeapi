const express = require("express");

const port = 8080

// app.listen(port,()=>{
//     console.log(`Server is running on port ${port}`)
// })
app.get("/api",(req,res)=>{
    res.status(200).send({message:"ok"})
})
