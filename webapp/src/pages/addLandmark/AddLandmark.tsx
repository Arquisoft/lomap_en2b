import markerIcon from "leaflet/dist/images/marker-icon.png"
import "./addLandmark.css";
import "../../map/stylesheets/addLandmark.css"
import React, {useRef, useState} from "react";
import {
    Button, Container, FormControl,
    Grid, Input, InputLabel,
    MenuItem, Select, Typography
} from "@mui/material";
import L from "leaflet";
import {Landmark, LandmarkCategories} from "../../shared/shareddtypes";
import {makeRequest} from "../../axios";
import {useSession} from "@inrupt/solid-ui-react";
import {MapContainer, TileLayer, useMapEvents} from "react-leaflet";
import {createLandmark} from "../../solidHelper/solidLandmarkManagement";

export default function AddLandmark() {

    const [coords, setCoords] = useState<number[]>([0,0]);
    const [option, setOption] = useState<string>("Other");
    const [marker, setMarker] = useState<L.Marker | null>(null);
    const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
    const {session} = useSession();

    let picture : string = "";

    const setPicture = (e : string) => {
        picture = e;
    }

    const setCoordinates = async (latitude : number, longitude : number) => {
        setIsButtonEnabled(false);
        (map.current as L.Map).panTo([latitude, longitude]);
        if (marker !== null) {
            (map.current as L.Map).removeLayer(marker);
        }
        (document.getElementById("latitude") as HTMLParagraphElement).textContent = latitude.toFixed(3);
        (document.getElementById("longitude") as HTMLParagraphElement).textContent = longitude.toFixed(3);
        await setMarker(new L.Marker([latitude, longitude]).setIcon(L.icon({iconUrl: markerIcon})).addTo(map.current as L.Map));
        await setCoords([latitude, longitude]);
        setIsButtonEnabled(true);        
    }

    const submit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Collect everything
        let name : string | undefined = (document.getElementById("name") as HTMLInputElement).value;
        if (name.trim() === "") {
            return;
        }
        let category : string = option;
        let latitude : number = coords[0];
        let longitude : number = coords[1];
        
        let description : string | undefined = (document.getElementById("description") as HTMLInputElement).value;

        let pictures : string[] = [];
        if(picture !== "") {
            pictures.push(picture);
        }


        let landmark : Landmark = {
            name : name,
            category : category,
            latitude : latitude,
            longitude : longitude,
            description : description,
            pictures : pictures
        }
        console.log(landmark);

        // Access to SOLID
        let webID = session.info.webId;
        if (webID !== undefined) {
            await createLandmark(webID, landmark);
        }
    };

    const map = useRef<L.Map>(null);
    let selectItems : JSX.Element[] = Object.keys(LandmarkCategories).map(key => {
        return <MenuItem data-testid = "option-test" value = {key} key = {key} onClick={() => setOption(key)}>{key}</MenuItem>;
    });

    const MapEvents = () => {
        useMapEvents(
            {
                click(e) {
                    setCoordinates(e.latlng.lat, e.latlng.lng);
                }
            }
        );
        return null;
    }

    return <Grid container>
            <Grid item xs = {12}>
            <Typography variant="h1" component="h1" textAlign={"center"} style={{color:"#FFF", fontSize: 46}} >Add a landmark</Typography>
            </Grid>
            <Grid item xs = {4} className = "leftPane">
                <form method = "post" className ="addLandmarkForm" onSubmit={submit} data-testid = "form-test">
                    <Grid container spacing={3} rowGap={8}>
                        <FormControl fullWidth data-testid = "firstField-testid">
                            <InputLabel style={{color:"#FFF"}}>Name of the landmark</InputLabel>
                            <Input id = "name" name = "name" style={{color:"#FFF"}}></Input>
                        </FormControl>
                        <FormControl fullWidth data-testid = "secondField-testid">
                            <InputLabel htmlFor="category" style={{color:"#FFF"}}>Category of the landmark</InputLabel>
                            <Select id = "category" name = "category" defaultValue={"Other"} style={{color:"#FFF"}}>
                                {selectItems}
                            </Select>
                        </FormControl>
                        <Grid container rowGap = {4} data-testid="thirdField-testid">
                            <FormControl fullWidth>
                                <Typography style={{color:"#FFF"}}>Latitude:  </Typography>
                                <Typography id = "latitude" style={{color:"#FFF"}}/>
                            </FormControl>
                            <FormControl fullWidth>
                                <Typography style={{color:"#FFF"}}>Longitude:  </Typography>
                                <Typography id = "longitude" style={{color:"#FFF"}}/>
                            </FormControl>  
                            <FormControl fullWidth data-testid = "firstField-testid">
                                <InputLabel style={{color:"#FFF"}}>Description</InputLabel>
                                <Input id = "description" name = "description" style={{color:"#FFF"}}></Input>
                            </FormControl>
                            <FormControl>
                                <Typography style={{color:"#FFF"}}>Add an image</Typography>
                                <input type="file" id="images" accept=".jpg" onChange={function (e) {
                                    const target = e.target as HTMLInputElement;
                                    if (target.files == null){
                                        return;
                                    }
                                    const file = target.files[0];
                                  
                                    if (!file) {
                                      return;
                                    }
                                  
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const result = event.target?.result as string;
                                      setPicture(result);
                                    };
                                    reader.readAsDataURL(file);
                                }}/>
                            </FormControl>     
                            </Grid>
                                {isButtonEnabled 
                                ? <Grid item justifyContent="flex-end">
                                <Button type = "submit" variant = "contained" data-testid="Save button">
                                    Save new landmark
                                </Button>
                            </Grid> 
                            : null
                        }
                    </Grid>
                </form>
            </Grid>
            <Grid item xs = {8} className = "rightPane">
                <MapContainer center={[50.847, 4.357]} zoom={13} scrollWheelZoom={true} ref={map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents />
            </MapContainer>;
            </Grid>
        </Grid>
        ;
}
