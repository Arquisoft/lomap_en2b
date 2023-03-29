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

module.exports = router;

