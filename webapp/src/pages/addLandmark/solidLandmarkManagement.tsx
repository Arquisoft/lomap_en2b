import type { Landmark, Review }from "../../shared/shareddtypes";
import { fetch } from "@inrupt/solid-client-authn-browser";

import {
    createThing, setThing, buildThing,
    getSolidDataset, saveSolidDatasetAt,
    createSolidDataset, getStringNoLocale,
    Thing, getThing, getThingAll,
    getSolidDatasetWithAcl, hasResourceAcl,
    hasFallbackAcl, hasAccessibleAcl, createAcl,
    createAclFromFallbackAcl, getResourceAcl,
    setAgentResourceAccess, saveAclFor,
    setAgentDefaultAccess, getUrl, getUrlAll,
    getFile, isRawData,
  } from "@inrupt/solid-client";
  
  import { SCHEMA_INRUPT, RDF, FOAF, VCARD} from "@inrupt/vocab-common-rdf";
  
  import {v4 as uuid} from "uuid";
// Reading landmarks from POD

/**  
 * Get all the landmarks from the pod
 * @param webID contains the user webID
 * @returns array of landmarks
 */
export async function getLocations(webID:string | undefined) {
  if (webID === undefined) {
    throw new Error("The user is not logged in");
    return;
  }
  let inventoryFolder = webID.split("profile")[0] + "private/lomap/inventory/index.ttl"; // inventory folder path
  let landmarks: Landmark[] = []; // initialize array of landmarks
  let landmarkPaths; 
  try {
    let dataSet = await getSolidDataset(inventoryFolder, {fetch: fetch}); // get the inventory dataset
    landmarkPaths = getThingAll(dataSet) // get the things from the dataset (landmark paths)
    for (let landmarkPath of landmarkPaths) { // for each landmark in the dataset
      // get the path of the actual landmark
      let path = getStringNoLocale(landmarkPath, SCHEMA_INRUPT.identifier) as string;
      // get the landmark : Location from the dataset of that landmark
      try{
        let landmark = await getLocationFromDataset(path)
        landmarks.push(landmark)
        // add the landmark to the array
      }
      catch(error){
        //The url is not accessed(no permision)
      }
     
    }
  } catch (error) {
    // if the landmark dataset does no exist, return empty array of landmarks
    landmarks = [];
  }
  // return the landmarks
  return landmarks;
}
/**
 * Retrieve the landmark from its dataset
 * @param landmarkPath contains the path of the landmark dataset
 * @returns landmark object
 */
export async function getLocationFromDataset(landmarkPath:string){
  let datasetPath = landmarkPath.split('#')[0] // get until index.ttl
  let landmarkDataset = await getSolidDataset(datasetPath, {fetch: fetch}) // get the whole dataset
  let landmarkAsThing = getThing(landmarkDataset, landmarkPath) as Thing; // get the landmark as thing
  // retrieve landmark information
  let name = getStringNoLocale(landmarkAsThing, SCHEMA_INRUPT.name) as string; 
  let longitude = getStringNoLocale(landmarkAsThing, SCHEMA_INRUPT.longitude) as string; 
  let latitude = getStringNoLocale(landmarkAsThing, SCHEMA_INRUPT.latitude) as string; 
  let description = getStringNoLocale(landmarkAsThing, SCHEMA_INRUPT.description) as string; 
  let url = getStringNoLocale(landmarkAsThing, SCHEMA_INRUPT.identifier) as string;
  let categoriesDeserialized = getStringNoLocale(landmarkAsThing, SCHEMA_INRUPT.Product) as string;
 
  let pictures: string [] = []; // initialize array to store the images as strings
  pictures = await getLocationImage(datasetPath); // get the images
  let reviews: Review[] = []; // initialize array to store the reviews
  reviews = await getLocationReviews(datasetPath) // get the reviews
  let scores : Map<string, number>; // map to store the ratings
  scores = await getLocationScores(datasetPath); // get the ratings
  
  // create Location object
  let landmark : Landmark = {
        name: name,
        category: categoriesDeserialized,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        description: description,
        reviews: reviews,
        scores: scores,
        pictures: pictures,
        url: url,
  }
  return landmark;
}
/**
 * Given the folder containing the images of the landmarks, gets the images (things) inside the dataset.
 * @param imagesFolderUrl url of the images folder
 * @returns string[] containing the images
 */
export async function getLocationImage(imagesFolderUrl:string){
  let images: string[] = [];
  let imagesThings;
  try {
    let imagesDataSet = await getSolidDataset(imagesFolderUrl, {fetch: fetch}); // get images dataset
    imagesThings = getThingAll(imagesDataSet) // get all the things in the images dataset
    for (let image of imagesThings){
      try{
      const file = await getFile(
        image.url,               // File in Pod to Read
        { fetch: fetch }       // fetch from authenticated session
      );
      if(isRawData(file)){//If it's a file(not dataset)
        images.push(URL.createObjectURL(file));//Creates the file as URL and pushes it to the
      }
    }catch(e){
    }
    }
  } catch (error){
    // if the dataset does not exist, return empty array of images
    images = [];
  }
  return images;
}
/**
 * Get the reviews of a landmark
 * @param folder contains the dataset containing the reviews
 * @returns array of reviews
 */
export async function getLocationReviews(folder:string) {
    let reviews : Review[] = [];
    try {
      let dataSet = await getSolidDataset(folder, {fetch:fetch}); // get dataset
      // get all things in the dataset of type review
      let things = getThingAll(dataSet).filter((thing) => getUrl(thing, VCARD.Type) === VCARD.hasNote)
      // for each review, create it and add it to the array
      for (let review of things) {
        // get review information
        let title = getStringNoLocale(review, SCHEMA_INRUPT.name) as string;
        let content = getStringNoLocale(review, SCHEMA_INRUPT.description) as string;
        let date = getStringNoLocale(review, SCHEMA_INRUPT.startDate) as string;
        let webId = getStringNoLocale(review, SCHEMA_INRUPT.Person) as string;
        let name = getStringNoLocale(await getUserProfile(webId),FOAF.name) as string;
  
        let newReview : Review = {
          title: title,
          content: content,
          date: date,
          webId: webId,
          username: name
        }
        reviews.push(newReview);
      }
  
    } catch (error) {
      // if there are any errors, retrieve empty array of reviews
      reviews = [];
    }
    return reviews;
  }
/**
 * Get the scores of a landmark
 * @param folder contains the dataset containing the scores
 * @returns Map containing the scores and their creator
 */
export async function getLocationScores(folder:string) {
    let scores : Map<string,number> = new Map<string,number>(); 
    try {
      let dataSet = await getSolidDataset(folder, {fetch:fetch}); // get the whole dataset
      // get things of type score
      let things = getThingAll(dataSet).filter((thing) => getUrl(thing, VCARD.Type) === VCARD.hasValue)
      // for each score, create it and add it to the map
      for (let score of things) {
        let value = parseInt(getStringNoLocale(score, SCHEMA_INRUPT.value) as string);
        let webId = getStringNoLocale(score, SCHEMA_INRUPT.Person) as string;
  
        scores.set(webId, value);
      }
  
    } catch (error) {
      scores = new Map<string, number>(); // retrieve empty map
    }
    return scores;
  }
// Writing landmarks to POD
/**
 * Add the landmark to the inventory and creates the landmark dataset.
 * @param webID contains the user webID
 * @param landmark contains the landmark to be added
 */
export async function createLocation(webID:string, landmark:Landmark) {
    let baseURL = webID.split("profile")[0]; // url of the type https://<nombre>.inrupt.net/
    let landmarksFolder = baseURL + "private/lomap/inventory/index.ttl"; // inventory folder path
    let landmarkId;
    // add landmark to inventory
    try {
      landmarkId = await addLocationToInventory(landmarksFolder, landmark) // add the landmark to the inventory and get its ID
    } catch (error){
      // if the inventory does not exist, create it and add the landmark
      landmarkId = await createInventory(landmarksFolder, landmark)
    }
    if (landmarkId === undefined) 
      return; // if the landmark could not be added, return (error)
  
    // path for the new landmark dataset
    let individualLocationFolder = baseURL + "private/lomap/landmarks/" + landmarkId + "/index.ttl";
  
    // create dataset for the landmark
    try {
      await createLocationDataSet(individualLocationFolder, landmark, landmarkId)
    } catch (error) {
      console.log(error)
    }
}
/**
 * Adds the given landmark to the landmark inventory
 * @param landmarksFolder contains the inventory folder
 * @param landmark contains the landmark to be added
 * @returns string containing the uuid of the landmark
 */
export async function addLocationToInventory(landmarksFolder:string, landmark:Landmark) {
    let landmarkId = "LOC_" + uuid(); // create landmark uuid
    let landmarkURL = landmarksFolder.split("private")[0] + "private/lomap/landmarks/" + landmarkId + "/index.ttl#" + landmarkId // landmark dataset path
  
    let newLocation = buildThing(createThing({name: landmarkId}))
      .addStringNoLocale(SCHEMA_INRUPT.identifier, landmarkURL) // add to the thing the path of the landmark dataset
      .build();
    let inventory = await getSolidDataset(landmarksFolder, {fetch: fetch}) // get the inventory
    inventory = setThing(inventory, newLocation); // add thing to inventory
    try {
      await saveSolidDatasetAt(landmarksFolder, inventory, {fetch: fetch}) //save the inventory
      return landmarkId;
    } catch (error) {
      console.log(error);
    }
}
  /**
 * Creates the landmark inventory and adds the given landmark to it
 * @param landmarksFolder contains the path of the inventory
 * @param landmark contains the landmark object
 * @returns landmark uuid
 */
export async function createInventory(landmarksFolder: string, landmark:Landmark){
    let landmarkId = "LOC_" + uuid(); // landmark uuid
    let landmarkURL = landmarksFolder.split("private")[0] + "private/lomap/landmarks/" + landmarkId + "/index.ttl#" + landmarkId; // landmark dataset path
  
    let newLocation = buildThing(createThing({name: landmarkId})) // create thing with the landmark dataset path
      .addStringNoLocale(SCHEMA_INRUPT.identifier, landmarkURL)
      .build();
    
    let inventory = createSolidDataset() // create dataset for the inventory
    inventory = setThing(inventory, newLocation); // add name to inventory
    try {
      await saveSolidDatasetAt(landmarksFolder, inventory, {fetch: fetch}) // save inventory dataset
      return landmarkId;
    } catch (error) {
      console.log(error);
    }
}
/**
 * Create the landmark in the given folder
 * @param landmarkFolder contains the folder to store the landmark .../private/lomap/landmarks/${landmarkId}/index.ttl
 * @param landmark contains the landmark to be created
 * @param id contains the landmark uuid
 */
export async function createLocationDataSet(landmarkFolder:string, landmark:Landmark, id:string) {
    let landmarkIdUrl = `${landmarkFolder}#${id}` // construct the url of the landmark
  
    // create dataset for the landmark
    let dataSet = createSolidDataset();
    // build landmark thing
    let newLocation = buildThing(createThing({name: id})) 
    .addStringNoLocale(SCHEMA_INRUPT.name, landmark.name.toString())
    .addStringNoLocale(SCHEMA_INRUPT.longitude, landmark.longitude.toString())
    .addStringNoLocale(SCHEMA_INRUPT.latitude, landmark.latitude.toString())
    .addStringNoLocale(SCHEMA_INRUPT.description, "No description")
    .addStringNoLocale(SCHEMA_INRUPT.identifier, landmarkIdUrl) // store the url of the landmark
    .addStringNoLocale(SCHEMA_INRUPT.Product, landmark.category) // store string containing the categories
    .addUrl(RDF.type, "https://schema.org/Place")
    .build();
  
  
    dataSet = setThing(dataSet, newLocation); // store thing in dataset
    // save dataset to later add the images
    dataSet = await saveSolidDatasetAt(landmarkFolder, dataSet, {fetch: fetch}) // save dataset 
    await addLocationImage(landmarkFolder, landmark); // store the images
    try {
      await saveSolidDatasetAt(landmarkFolder, dataSet, {fetch: fetch}) // save dataset 
    } catch (error) {
      console.log(error)
    }
  }
  /**
 * Add the landmark images to the given folder
 * @param url contains the folder of the images
 * @param landmark contains the landmark
 */
export async function addLocationImage(url: string, landmark:Landmark) {
    let landmarkDataset = await getSolidDataset(url, {fetch: fetch})
    landmark.pictures?.forEach(async picture => { // for each picture of the landmark, build a thing and store it in dataset
        let newImage = buildThing(createThing({name: picture}))
        .addStringNoLocale(SCHEMA_INRUPT.image, picture)
        .build();
        landmarkDataset = setThing(landmarkDataset, newImage);
        try {
          landmarkDataset = await saveSolidDatasetAt(url, landmarkDataset, {fetch: fetch});
        } catch (error){
          console.log(error);
        }
      }
    );
  }
  /**
 * Add a review to the given landmark
 * @param landmark contains the landmark
 * @param review contains the review to be added to the landmark
 */
export async function addLocationReview(landmark:Landmark, review:Review){
    let url = landmark.url?.split("#")[0] as string; // get the path of the landmark dataset
    // get dataset
    let landmarkDataset = await getSolidDataset(url, {fetch: fetch})
    // create review
    let newReview = buildThing(createThing())
      .addStringNoLocale(SCHEMA_INRUPT.name, review.title)
      .addStringNoLocale(SCHEMA_INRUPT.description, review.content)
      .addStringNoLocale(SCHEMA_INRUPT.startDate, review.date)
      .addStringNoLocale(SCHEMA_INRUPT.Person, review.webId)
      .addUrl(VCARD.Type, VCARD.hasNote)
      .build();
    // store the review in the landmark dataset
    landmarkDataset = setThing(landmarkDataset, newReview)
  
    try {
      // save dataset
      landmarkDataset = await saveSolidDatasetAt(url, landmarkDataset, {fetch: fetch});
    } catch (error){
      console.log(error);
    }
  }
  
  /**
   * Add a rating to the given landmark
   * @param webId contains the webid of the user rating the landmark
   * @param landmark contains the landmark
   * @param score contains the score of the rating
   */
  export async function addLocationScore(webId:string, landmark:Landmark, score:number){
    let url = landmark.url?.split("#")[0] as string; // get landmark dataset path
    // get dataset
    let landmarkDataset = await getSolidDataset(url, {fetch: fetch})
    // create score
    let newScore = buildThing(createThing())
      .addStringNoLocale(SCHEMA_INRUPT.value, score.toString())
      .addStringNoLocale(SCHEMA_INRUPT.Person, webId)
      .addUrl(VCARD.Type, VCARD.hasValue)
      .build();
    // add score to the dataset
    landmarkDataset = setThing(landmarkDataset, newScore)
  
    try {
      // save dataset
      landmarkDataset = await saveSolidDatasetAt(url, landmarkDataset, {fetch: fetch});
    } catch (error){
      console.log(error);
    }
  }
// Friend management
/**
 * Grant/ Revoke permissions of friends regarding a particular landmark
 * @param friend webID of the friend to grant or revoke permissions
 * @param landmarkURL landmark to give/revoke permission to
 * @param giveAccess if true, permissions are granted, if false permissions are revoked
 */
export async function setAccessToFriend(friend:string, landmarkURL:string, giveAccess:boolean){
  let myInventory = `${landmarkURL.split("private")[0]}private/lomap/inventory/index.ttl`
  await giveAccessToInventory(myInventory, friend);
  let resourceURL = landmarkURL.split("#")[0]; // dataset path
  // Fetch the SolidDataset and its associated ACL, if available:
  let myDatasetWithAcl : any;
  try {
    myDatasetWithAcl = await getSolidDatasetWithAcl(resourceURL, {fetch: fetch});
    // Obtain the SolidDataset's own ACL, if available, or initialise a new one, if possible:
    let resourceAcl;
    if (!hasResourceAcl(myDatasetWithAcl)) {
      
      if (!hasFallbackAcl(myDatasetWithAcl)) {
        // create new access control list
        resourceAcl = createAcl(myDatasetWithAcl);
      }
      else{
        // create access control list from fallback
        resourceAcl = createAclFromFallbackAcl(myDatasetWithAcl);
      }
    } else {
      // get the access control list of the dataset
      resourceAcl = getResourceAcl(myDatasetWithAcl);
    }
  let updatedAcl;
  if (giveAccess) {
    // grant permissions
    updatedAcl = setAgentDefaultAccess(
      resourceAcl,
      friend,
      { read: true, append: true, write: false, control: true }
    );
  }
  else{
    // revoke permissions
    updatedAcl = setAgentDefaultAccess(
      resourceAcl,
      friend,
      { read: false, append: false, write: false, control: false }
    );
  }
  // save the access control list
  await saveAclFor(myDatasetWithAcl, updatedAcl, {fetch: fetch});
  }
  catch (error){ // catch any possible thrown errors
    console.log(error)
  }
}
export async function giveAccessToInventory(resourceURL:string, friend:string){
  let myDatasetWithAcl : any;
  try {
    myDatasetWithAcl = await getSolidDatasetWithAcl(resourceURL, {fetch: fetch}); // inventory
    // Obtain the SolidDataset's own ACL, if available, or initialise a new one, if possible:
    let resourceAcl;
    if (!hasResourceAcl(myDatasetWithAcl)) {
      if (!hasAccessibleAcl(myDatasetWithAcl)) {
        //  "The current user does not have permission to change access rights to this Resource."
      }
      if (!hasFallbackAcl(myDatasetWithAcl)) {
        // create new access control list
        resourceAcl = createAcl(myDatasetWithAcl);
      }
      else{
        // create access control list from fallback
        resourceAcl = createAclFromFallbackAcl(myDatasetWithAcl);
      }
    } else {
      // get the access control list of the dataset
      resourceAcl = getResourceAcl(myDatasetWithAcl);
    }
  let updatedAcl;
    // grant permissions
    updatedAcl = setAgentResourceAccess(
      resourceAcl,
      friend,
      { read: true, append: true, write: false, control: false }
    );
  // save the access control list
  await saveAclFor(myDatasetWithAcl, updatedAcl, {fetch: fetch});
  }
  catch (error){ // catch any possible thrown errors
    console.log(error)
  }
}
export async function addSolidFriend(webID: string,friendURL: string): Promise<{error:boolean, errorMessage:string}>{
    let profile = webID.split("#")[0];
    let dataSet = await getSolidDataset(profile+"#me", {fetch: fetch});//dataset card me
  
    let thing =await getThing(dataSet, profile+"#me") as Thing; // :me from dataset
  
    try{
      let newFriend = buildThing(thing)
      .addUrl(FOAF.knows, friendURL as string)
      .build();
  
      dataSet = setThing(dataSet, newFriend);
      dataSet = await saveSolidDatasetAt(webID, dataSet, {fetch: fetch})
    } catch(err){
      return{error:true,errorMessage:"The url is not valid."}
    }
  
    return{error:false,errorMessage:""}
  
  }
  export async function getFriendsLandmarks(webID:string){
    let friends = getUrlAll(await getUserProfile(webID), FOAF.knows);
    const landmarkPromises = friends.map(friend => getLocations(friend as string));
    return await Promise.all(landmarkPromises);
  }
  export async function getUserProfile(webID: string) : Promise<Thing>{
    // get the url of the full dataset
    let profile = webID.split("#")[0]; //just in case there is extra information in the url
    // get the dataset from the url
    let dataSet = await getSolidDataset(profile, {fetch: fetch});
    // return the dataset as a thing
    return getThing(dataSet, webID) as Thing;
}