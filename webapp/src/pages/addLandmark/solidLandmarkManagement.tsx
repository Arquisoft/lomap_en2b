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
    landmarkPaths = getThingAll(dataSet) // get the things from the dataset (Landmark paths)
    for (let landmarkPath of landmarkPaths) { // for each Landmark in the dataset
      // get the path of the actual Landmark
      let path = getStringNoLocale(landmarkPath, SCHEMA_INRUPT.identifier) as string;
      // get the Landmark : Location from the dataset of that Landmark
      try{
        let Landmark = await getLocationFromDataset(path)
        landmarks.push(Landmark)
        // add the Landmark to the array
      }
      catch(error){
        //The url is not accessed(no permision)
      }
     
    }
  } catch (error) {
    // if the Landmark dataset does no exist, return empty array of landmarks
    landmarks = [];
  }
  // return the landmarks
  return landmarks;
}

/**
 * Retrieve the Landmark from its dataset
 * @param landmarkPath contains the path of the Landmark dataset
 * @returns Landmark object
 */
export async function getLocationFromDataset(landmarkPath:string){
  let datasetPath = landmarkPath.split('#')[0] // get until index.ttl
  let landmarkDataset = await getSolidDataset(datasetPath, {fetch: fetch}) // get the whole dataset
  let landmarkAsThing = getThing(landmarkDataset, landmarkPath) as Thing; // get the Landmark as thing

  // retrieve Landmark information
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
  let Landmark : Landmark = {
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


  return Landmark;
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
 * Get the reviews of a Landmark
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
 * Get the scores of a Landmark
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
 * Add the Landmark to the inventory and creates the Landmark dataset.
 * @param webID contains the user webID
 * @param Landmark contains the Landmark to be added
 */
export async function createLocation(webID:string, Landmark:Landmark) {
    let baseURL = webID.split("profile")[0]; // url of the type https://<nombre>.inrupt.net/
    let landmarksFolder = baseURL + "private/lomap/inventory/index.ttl"; // inventory folder path
    let landmarkId;
    // add Landmark to inventory
    try {
      landmarkId = await addLocationToInventory(landmarksFolder, Landmark) // add the Landmark to the inventory and get its ID
    } catch (error){
      // if the inventory does not exist, create it and add the Landmark
      landmarkId = await createInventory(landmarksFolder, Landmark)
    }
    if (landmarkId === undefined) 
      return; // if the Landmark could not be added, return (error)
  
    // path for the new Landmark dataset
    let individualLocationFolder = baseURL + "private/lomap/landmarks/" + landmarkId + "/index.ttl";
  
    // create dataset for the Landmark
    try {
      await createLocationDataSet(individualLocationFolder, Landmark, landmarkId)
    } catch (error) {
      console.log(error)
    }
}

/**
 * Adds the given Landmark to the Landmark inventory
 * @param landmarksFolder contains the inventory folder
 * @param Landmark contains the Landmark to be added
 * @returns string containing the uuid of the Landmark
 */
export async function addLocationToInventory(landmarksFolder:string, Landmark:Landmark) {
    let landmarkId = "LOC_" + uuid(); // create Landmark uuid
    let landmarkURL = landmarksFolder.split("private")[0] + "private/lomap/landmarks/" + landmarkId + "/index.ttl#" + landmarkId // Landmark dataset path
  
    let newLocation = buildThing(createThing({name: landmarkId}))
      .addStringNoLocale(SCHEMA_INRUPT.identifier, landmarkURL) // add to the thing the path of the Landmark dataset
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
 * Creates the Landmark inventory and adds the given Landmark to it
 * @param landmarksFolder contains the path of the inventory
 * @param Landmark contains the Landmark object
 * @returns Landmark uuid
 */
export async function createInventory(landmarksFolder: string, Landmark:Landmark){
    let landmarkId = "LOC_" + uuid(); // Landmark uuid
    let landmarkURL = landmarksFolder.split("private")[0] + "private/lomap/landmarks/" + landmarkId + "/index.ttl#" + landmarkId; // Landmark dataset path
  
    let newLocation = buildThing(createThing({name: landmarkId})) // create thing with the Landmark dataset path
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
 * Create the Landmark in the given folder
 * @param landmarkFolder contains the folder to store the Landmark .../private/lomap/landmarks/${landmarkId}/index.ttl
 * @param Landmark contains the Landmark to be created
 * @param id contains the Landmark uuid
 */
export async function createLocationDataSet(landmarkFolder:string, Landmark:Landmark, id:string) {
    let landmarkIdUrl = `${landmarkFolder}#${id}` // construct the url of the Landmark
  
    // create dataset for the Landmark
    let dataSet = createSolidDataset();
    // build Landmark thing
    let newLocation = buildThing(createThing({name: id})) 
    .addStringNoLocale(SCHEMA_INRUPT.name, Landmark.name.toString())
    .addStringNoLocale(SCHEMA_INRUPT.longitude, Landmark.longitude.toString())
    .addStringNoLocale(SCHEMA_INRUPT.latitude, Landmark.latitude.toString())
    .addStringNoLocale(SCHEMA_INRUPT.description, "No description")
    .addStringNoLocale(SCHEMA_INRUPT.identifier, landmarkIdUrl) // store the url of the Landmark
    .addStringNoLocale(SCHEMA_INRUPT.Product, Landmark.category) // store string containing the categories
    .addUrl(RDF.type, "https://schema.org/Place")
    .build();
  
  
    dataSet = setThing(dataSet, newLocation); // store thing in dataset
    // save dataset to later add the images
    dataSet = await saveSolidDatasetAt(landmarkFolder, dataSet, {fetch: fetch}) // save dataset 
    await addLocationImage(landmarkFolder, Landmark); // store the images
    try {
      await saveSolidDatasetAt(landmarkFolder, dataSet, {fetch: fetch}) // save dataset 
    } catch (error) {
      console.log(error)
    }
  }


  /**
 * Add the Landmark images to the given folder
 * @param url contains the folder of the images
 * @param Landmark contains the Landmark
 */
export async function addLocationImage(url: string, Landmark:Landmark) {
    let landmarkDataset = await getSolidDataset(url, {fetch: fetch})
    Landmark.pictures?.forEach(async picture => { // for each picture of the Landmark, build a thing and store it in dataset
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
 * Add a review to the given Landmark
 * @param Landmark contains the Landmark
 * @param review contains the review to be added to the Landmark
 */
export async function addLocationReview(Landmark:Landmark, review:Review){
    let url = Landmark.url?.split("#")[0] as string; // get the path of the Landmark dataset
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
    // store the review in the Landmark dataset
    landmarkDataset = setThing(landmarkDataset, newReview)
  
    try {
      // save dataset
      landmarkDataset = await saveSolidDatasetAt(url, landmarkDataset, {fetch: fetch});
    } catch (error){
      console.log(error);
    }
  }
  
  /**
   * Add a rating to the given Landmark
   * @param webId contains the webid of the user rating the Landmark
   * @param Landmark contains the Landmark
   * @param score contains the score of the rating
   */
  export async function addLocationScore(webId:string, Landmark:Landmark, score:number){
    let url = Landmark.url?.split("#")[0] as string; // get Landmark dataset path
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
