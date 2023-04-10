import { RequestHandler } from "express";
import { addLandmark } from "../solid/solidLandmark";
import { json } from "body-parser";
import { useSession } from '@inrupt/solid-ui-react';

const session = useSession();

export const test: RequestHandler = async (req, res) => {

   res.json({test: "test"})
}

export const addNewLandmark :RequestHandler = async(req, res) => {
    try {
        let data = req.body;

        addLandmark(session.info.webID , data.location) 

        res.status(200)
    } catch (err) {
        res.status(500).json(err);
    }
}