import express from "express";
import { getSolidDataset, Thing, getThing, getStringNoLocale,getUrlAll} from "@inrupt/solid-client";
const User = require("../models/User");
const router = express.Router();
import { FOAF,VCARD } from "@inrupt/vocab-common-rdf";

async function getUserThing(webID : string){
    const result = await User.findById(webID);
   
    const profile = result.solidURL;
   
    let dataSet = await getSolidDataset(profile, {fetch: fetch});
    
    return getThing(dataSet, profile+"#me") as Thing;
};
router.get("/:id/name",async (req : any, res : any) => {
    try {
    const id = req.params.id;
    console.log("GET /solid/" + id+"/name");
    let thing = await getUserThing(id);

    // NAME ======================
    const name = getStringNoLocale(thing,FOAF.name)
    res.status(200).send(name);
    } catch (err) {
        res.status(500).json(err);
     }
});

router.get("/:id/friends",async (req : any, res : any) => {
    try {
    const id = req.params.id;
    console.log("GET /solid/" + id+"/friends");
    let thing = await getUserThing(id);
    let friendURLs = getUrlAll(thing, VCARD.Contact);

    console.log(friendURLs);
    res.status(200).send(friendURLs);
    } catch (err) {
        res.status(500).json(err);
        }
});


module.exports = router;