import type { Landmark }from "../../shared/shareddtypes";
import { fetch } from "@inrupt/solid-client-authn-browser";

import {
    createThing, setThing, buildThing,
    getSolidDataset, saveSolidDatasetAt,
    createSolidDataset, getStringNoLocale,
    Thing, getThing, getThingAll
  } from "@inrupt/solid-client";
  
  import { SCHEMA_INRUPT, RDF} from "@inrupt/vocab-common-rdf"
  
  import {v4 as uuid} from "uuid" // for the uuids of the locations

  // ****************************************
/*
=== POD STRUCTURE ===
At this moment, the structure of the information stored in the pod sticks to the following architecture:
+ All the information belonging to LoMap is stored in the private folder of the user's pod, more precisely in
  private/lomap.
+ A dataset for each location was created to ease the manipulation of data and the granting of the access
  to some locations (friends logic). This datasets are contained in private/lomap/locations/{locationId}/index.ttl
  This dataset contains:
    # The location Thing itselft (name, description, longitude, latitude ...)
    # Things representing the images of the location
    # Things representing the reviews of the location
    # Things representing the ratings of the location.
+ Apart from that folder hierarchy, another one is needed to register the locations. If this was not done, we would have
  to iterate through all the folders of the locations directory in order to retrieve all of them. Since we did not 
  find an efficient way of doing this, we keep a locations record, which stores the location path for each one of them.
  This record is stored in /private/lomap/inventory/index.ttl

  TREE REPRESENTATION 
  - private
    - lomap
      - locations
        - LOC_ID1
          - location Thing
          - images Things
          - reviews Things
          - scores Things
        - LOC_ID2
          - . . .
        - . . .
      - inventory
        - LOC_ID1 path (private/lomap/locations/LOC_ID1)
        - LOC_ID2 path (private/lomap/locations/LOC_ID2)
        - . . .
*/


// ************** FUNCTIONS *****************

// READ FUNCTIONS

/**
 * Get all the locations from the pod
 * @param webID contains the user webID
 * @returns array of locations
 */
export async function getLocations(webID:string) {
  let inventoryFolder = webID.split("profile")[0] + "private/lomap/inventory/index.ttl"; // inventory folder path
  let locations: Landmark[] = []; // initialize array of locations
  let locationPaths; 
  try {
    let dataSet = await getSolidDataset(inventoryFolder, {fetch: fetch}); // get the inventory dataset
    locationPaths = getThingAll(dataSet) // get the things from the dataset (location paths)
    for (let locationPath of locationPaths) { // for each location in the dataset
      // get the path of the actual location
      let path = getStringNoLocale(locationPath, SCHEMA_INRUPT.identifier) as string;
      // get the location : Location from the dataset of that location
      try{
        let location = await getLocationFromDataset(path)
        locations.push(location)
        // add the location to the array
      }
      catch(error){
        //The url is not accessed(no permision)
      }
     
    }
  } catch (error) {
    // if the location dataset does no exist, return empty array of locations
    locations = [];
  }
  // return the locations
  return locations;
}

/**
 * Retrieve the location from its dataset
 * @param locationPath contains the path of the location dataset
 * @returns location object
 */
export async function getLocationFromDataset(locationPath:string){
  let datasetPath = locationPath.split('#')[0] // get until index.ttl
  let locationDataset = await getSolidDataset(datasetPath, {fetch: fetch}) // get the whole dataset
  let locationAsThing = getThing(locationDataset, locationPath) as Thing; // get the location as thing

  // retrieve location information
  let name = getStringNoLocale(locationAsThing, SCHEMA_INRUPT.name) as string; 
  let longitude = getStringNoLocale(locationAsThing, SCHEMA_INRUPT.longitude) as string; 
  let latitude = getStringNoLocale(locationAsThing, SCHEMA_INRUPT.latitude) as string; 
  let description = getStringNoLocale(locationAsThing, SCHEMA_INRUPT.description) as string; 
  let url = getStringNoLocale(locationAsThing, SCHEMA_INRUPT.identifier) as string;
  let categoriesDeserialized = getStringNoLocale(locationAsThing, SCHEMA_INRUPT.Product) as string;

 /* 
  let locationImages: string = ""; // initialize array to store the images as strings
  locationImages = await getLocationImage(datasetPath); // get the images
  let reviews: string = ""; // initialize array to store the reviews
  reviews = await getLocationReviews(datasetPath) // get the reviews
  let scores : number; // map to store the ratings
  scores = await getLocationScores(datasetPath); // get the ratings
  */

  // create Location object
  let landmark : Landmark = {
      name: name,
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
      url: url,
      category: categoriesDeserialized,
  }
  return landmark;
}




// WRITE FUNCTIONS

/**
 * Add the location to the inventory and creates the location dataset.
 * @param webID contains the user webID
 * @param location contains the location to be added
 */
export async function createLocation(webID:string, location:Landmark) {
    let baseURL = webID.split("profile")[0]; // url of the type https://<nombre>.inrupt.net/
    let locationsFolder = baseURL + "private/lomap/inventory/index.ttl"; // inventory folder path
    let locationId;
    // add location to inventory
    try {
      locationId = await addLocationToInventory(locationsFolder, location) // add the location to the inventory and get its ID
    } catch (error){
      // if the inventory does not exist, create it and add the location
      locationId = await createInventory(locationsFolder, location)
    }
    if (locationId === undefined) 
      return; // if the location could not be added, return (error)
  
    // path for the new location dataset
    let individualLocationFolder = baseURL + "private/lomap/locations/" + locationId + "/index.ttl";
  
    // create dataset for the location
    try {
      await createLocationDataSet(individualLocationFolder, location, locationId)
    } catch (error) {
      console.log(error)
    }
}

/**
 * Adds the given location to the location inventory
 * @param locationsFolder contains the inventory folder
 * @param location contains the location to be added
 * @returns string containing the uuid of the location
 */
export async function addLocationToInventory(locationsFolder:string, location:Landmark) {
    let locationId = "LOC_" + uuid(); // create location uuid
    let locationURL = locationsFolder.split("private")[0] + "private/lomap/locations/" + locationId + "/index.ttl#" + locationId // location dataset path
  
    let newLocation = buildThing(createThing({name: locationId}))
      .addStringNoLocale(SCHEMA_INRUPT.identifier, locationURL) // add to the thing the path of the location dataset
      .build();

    let inventory = await getSolidDataset(locationsFolder, {fetch: fetch}) // get the inventory
    inventory = setThing(inventory, newLocation); // add thing to inventory
    try {
      await saveSolidDatasetAt(locationsFolder, inventory, {fetch: fetch}) //save the inventory
      return locationId;
    } catch (error) {
      console.log(error);
    }
}

  /**
 * Creates the location inventory and adds the given location to it
 * @param locationsFolder contains the path of the inventory
 * @param location contains the location object
 * @returns location uuid
 */
export async function createInventory(locationsFolder: string, location:Landmark){
    let locationId = "LOC_" + uuid(); // location uuid
    let locationURL = locationsFolder.split("private")[0] + "private/lomap/locations/" + locationId + "/index.ttl#" + locationId; // location dataset path
  
    let newLocation = buildThing(createThing({name: locationId})) // create thing with the location dataset path
      .addStringNoLocale(SCHEMA_INRUPT.identifier, locationURL)
      .build();
    
    let inventory = createSolidDataset() // create dataset for the inventory
    inventory = setThing(inventory, newLocation); // add name to inventory
    try {
      await saveSolidDatasetAt(locationsFolder, inventory, {fetch: fetch}) // save inventory dataset
      return locationId;
    } catch (error) {
      console.log(error);
    }
}

/**
 * Create the location in the given folder
 * @param locationFolder contains the folder to store the location .../private/lomap/locations/${locationId}/index.ttl
 * @param location contains the location to be created
 * @param id contains the location uuid
 */
export async function createLocationDataSet(locationFolder:string, location:Landmark, id:string) {
    let locationIdUrl = `${locationFolder}#${id}` // construct the url of the location
  
    // create dataset for the location
    let dataSet = createSolidDataset();
    // build location thing
    let newLocation = buildThing(createThing({name: id})) 
    .addStringNoLocale(SCHEMA_INRUPT.name, location.name.toString())
    .addStringNoLocale(SCHEMA_INRUPT.longitude, location.longitude.toString())
    .addStringNoLocale(SCHEMA_INRUPT.latitude, location.latitude.toString())
    .addStringNoLocale(SCHEMA_INRUPT.description, "No description")
    .addStringNoLocale(SCHEMA_INRUPT.identifier, locationIdUrl) // store the url of the location
    .addStringNoLocale(SCHEMA_INRUPT.Product, location.category) // store string containing the categories
    .addUrl(RDF.type, "https://schema.org/Place")
    .build();
  
  
    dataSet = setThing(dataSet, newLocation); // store thing in dataset
    // save dataset to later add the images
    dataSet = await saveSolidDatasetAt(locationFolder, dataSet, {fetch: fetch}) // save dataset 
    await addLocationImage(locationFolder, location); // store the images
    try {
      await saveSolidDatasetAt(locationFolder, dataSet, {fetch: fetch}) // save dataset 
    } catch (error) {
      console.log(error)
    }
  }


  /**
 * Add the location images to the given folder
 * @param url contains the folder of the images
 * @param location contains the location
 */
export async function addLocationImage(url: string, location:Landmark) {
    /*let locationDataset = await getSolidDataset(url, {fetch: fetch})
    location.images?.forEach(async image => { // for each image of the location, build a thing and store it in dataset
        let newImage = buildThing(createThing({name: image}))
        .addStringNoLocale(SCHEMA_INRUPT.image, image)
        .build();
        locationDataset = setThing(locationDataset, newImage);
        try {
          locationDataset = await saveSolidDatasetAt(url, locationDataset, {fetch: fetch});
        } catch (error){
          console.log(error);
        }
      }
    );*/
  }