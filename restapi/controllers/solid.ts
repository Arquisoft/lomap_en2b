import express from "express";
import { getSolidDataset, Thing, getThing} from "@inrupt/solid-client";
const User = require("../models/User");
const router = express.Router();

router.get("/:id",async (req, res) => {
    const id = req.params.id;
    console.log("GET /solid/" + id);
    const webID = User.findOneById(id).solidURL;

    let profile = webID.split("#")[0]; 
    let dataSet = await getSolidDataset(profile, {fetch: fetch});
    // return the dataset as a thing
    const thing = getThing(dataSet, webID) as Thing;

    res.status(200).send(thing);
});
module.exports = router;