import express from "express";

const router = express.Router();
const User = require("../models/User");
  
router.get("/:text", async (req : any, res : any, next : any) => {
    const searchText = req.params.text;
    try {
      const result = await User.find({
        username: searchText
      });
      res.status(200).json(result);
    }
    catch (err){
      res.status(404).json("User not found");
    }
  });

router.get("/id/:id", async (req : any, res : any, next : any) => {
    const id = req.params.id;
    try {
      const result = await User.findById(id);

      res.status(200).json(result);
    }
    catch (err){
      res.status(404).json("User not found");
    }
  });


router.patch("/", async (req : any, res : any, next : any) => {
    try {
      console.log("PATCH /users/");

      const result = await User.findOne({solidURL: req.body.webId.toString()});

      res.status(200).json(result._id);
    }catch(err){
      res.status(404).json(err);
    }
  });

router.post("/", async (req : any, res : any, next : any) => {
    try {

      if(!req.body.solidURL){
        res.status(400).json("No solidURL provided");
        return;
      }
      let id = req.body.solidURL;
      id = id.split("#")[0]
      const url = new URL(id);
      const hostParts = url.host.split('.');
      const username = hostParts[0];
      
      const user = new User({solidURL: id, username: username});
      const result = await user.save();
      console.log("POST /users/");
      res.status(201).json(result);
  
    } catch(err){
      res.status(404).json(err);
    }
  });
module.exports = router;

