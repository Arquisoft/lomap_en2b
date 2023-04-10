import type { Landmark } from "../../webapp/src/shared/shareddtypes";
import { 
  getSessionFromStorage,
  getSessionIdFromStorageAll,
  Session
} from "@inrupt/solid-client-authn-node";

import {
  createThing, removeThing,Thing,getThing, setThing,buildThing,
  getSolidDataset, saveSolidDatasetAt, 
  removeUrl, getUrlAll,
  getStringNoLocale
} from "@inrupt/solid-client";

import { VCARD } from "@inrupt/vocab-common-rdf"

const session = new Session();


export async function getUserProfile(webID: string) : Promise<Thing>{
    // get the url of the full dataset
    let profile = webID.split("#")[0]; //just in case there is extra information in the url
    // get the dataset from the url
    let dataSet = await getSolidDataset(profile, {});
    // return the dataset as a thing
    return getThing(dataSet, webID) as Thing;
}

export async function addLandmark(webID: string, landmark:Landmark) {
    // get the url of the dataset
    let profile = webID.split("#")[0]; 
    // authenticate
    let dataSet = await getSolidDataset(profile, {fetch: session.fetch});

    // We create the landmark
    const newLandmark = buildThing(createThing())
        .addStringNoLocale(VCARD.Name, landmark.name.toString())
        .addStringNoLocale(VCARD.longitude, landmark.longitude.toString())
        .addStringNoLocale(VCARD.latitude, landmark.latitude.toString())
        .addStringNoLocale(VCARD.Text, landmark.comment.toString())
        .addStringNoLocale(VCARD.category, landmark.category.toString())
        .addUrl(VCARD.Type, VCARD.Location)
        .build();

    // check if landmarks exist
    let existLocations = await getThing(dataSet, VCARD.hasGeo) as Thing;
    // if they dont
    if (existLocations === null){
        existLocations = buildThing(await getUserProfile(webID)).addUrl(VCARD.hasGeo, newLandmark.url).build();
    }
    // if they do, add it
    else{
        existLocations = buildThing(existLocations).addUrl(VCARD.hasGeo, newLandmark.url).build();
    }

    dataSet = setThing(dataSet, newLandmark);
    dataSet = setThing(dataSet, existLocations);

    return await saveSolidDatasetAt(webID, dataSet, {fetch: fetch})
}

export async function getLandmarks(webID:string) : Promise<Array<Landmark>> {
  
    let landmarksURLs = getUrlAll(await getUserProfile(webID), VCARD.hasGeo);
    let landmarks: Landmark[] = [];
  
    // for each location url, get the fields of the object
    for (let landmark of landmarksURLs) {
      let name = getStringNoLocale(
        await getUserProfile(landmark),
        VCARD.Name
      ) as string;
      let longitude = getStringNoLocale(
        await getUserProfile(landmark),
        VCARD.longitude
      ) as string;
      let latitude = getStringNoLocale(
        await getUserProfile(landmark),
        VCARD.latitude
      ) as string;
      let comment = getStringNoLocale(
        await getUserProfile(landmark),
        VCARD.Text
      ) as string;
      let category = getStringNoLocale(
        await getUserProfile(landmark),
        VCARD.category
      ) as string;
  
      if (landmark)
        landmarks.push({
          name: name,
          longitude : Number(longitude),
          latitude : Number(latitude),
          comment: comment,
          category: category
        }
      );
    }
    
    return landmarks;
  
  }