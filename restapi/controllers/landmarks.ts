import express from "express";

const router = express.Router();
const Landmark = require("../models/Landmark");

router.post("/friend", async (req: any, res: any) => {
    try {
        console.log("POST /landmarks/friend");

        const results = await Landmark.find({webId: req.body.webID.toString()});

        res.status(200).send(results);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/", async (req: any, res: any, next: any) => {
    try {
        console.log("POST /landmarks/");
        const landmark = Landmark.create(
            {name: req.body.name.toString(), category: req.body.category.toString(), latitude: req.body.latitude, 
            longitude: req.body.longitude, webID: req.body.webID.toString()});
        
            const result = await landmark.save();
        res.status(200).send(result);
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;