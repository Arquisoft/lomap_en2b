import express from "express";

const router = express.Router();
const User = require("../models/User");
  
router.get("/:text", async (req : any, res : any, next : any) => {
    const searchText = req.params.text;
    try {
      const result = await User.find({
        username: searchText
      })
      res.status(200).json(result);
    }
    catch (err){
      res.status(404).json("User not found");
    }
  });

router.get("/", async (req : any, res : any, next : any) => {
    try {
      console.log("GET /users/");
      console.log("pito"+req.headers.webId);
      const result = await User.findOne({solidURL: req.headers.webId});
      res.status(200).json(result._id);
    }catch(err){
      res.status(404).json("User not found");
    }
  });

router.post("/", async (req : any, res : any, next : any) => {
    try {
      if(!req.body.solidURL){
        res.status(400).json("No solidURL provided");
        return;
      }
      const id = req.body.solidURL;
      const url = new URL(id);
      const hostParts = url.host.split('.');
      const username = hostParts[0];
      
      const user = new User({solidURL: id, username: username});
      const result = await user.save();
      console.log("POST /users/");
      res.status(201).json(result);
  
    }
      catch(err){
       
      }
    });
module.exports = router;

