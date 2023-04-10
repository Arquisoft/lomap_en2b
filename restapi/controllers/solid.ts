import express from "express";
import { getSolidDataset, Thing, getThing, getStringNoLocale, getUrlAll, buildThing, setThing,saveSolidDatasetAt } from "@inrupt/solid-client";
const User = require("../models/User");
const router = express.Router();
import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";

async function getUserThing(webID: string) {
    const result = await User.findById(webID);

    const profile = result.solidURL;

    let dataSet = await getSolidDataset(profile, { fetch: fetch });

    return getThing(dataSet, profile + "#me") as Thing;
};
router.get("/:id/name", async (req: any, res: any) => {
    try {
        const id = req.params.id;
        console.log("GET /solid/" + id + "/name");
        let thing = await getUserThing(id);

        // NAME ======================
        const name = getStringNoLocale(thing, FOAF.name)
        res.status(200).send(name);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/:id/friends", async (req: any, res: any) => {
    try {
        const id = req.params.id;
        console.log("GET /solid/" + id + "/friends");
        let thing = await getUserThing(id);
        let friendURLs = getUrlAll(thing, FOAF.knows);

        friendURLs = friendURLs.map((url: string) => url.split("#")[0]);
        //codigo sucio

        const friends = await User.find({ solidURL: { $in: friendURLs } });

        res.status(200).send(friends);


    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/addFriend", async (req: any, res: any, next: any) => {
    try {
        console.log("POST /solid/addFriend");
        let dataSet = await getSolidDataset(req.body.webID.split("#")[0], { fetch: fetch });

        let userThing = getThing(dataSet, req.body.webID) as Thing;

        let newFriend = buildThing(userThing)
            .addUrl(FOAF.knows, req.body.friendWID as string)
            .build();


        dataSet = setThing(dataSet, userThing);
        dataSet = await saveSolidDatasetAt(req.body.webID, dataSet, { fetch: fetch })
       
        res.status(200).json("Friend added");
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;