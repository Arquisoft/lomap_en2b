export type User = {
    solidURL:string;
    username:string;
    email:string;
    _id:string;
    landmarks?:Landmark[];
  };

export type Landmark = {
    name:string;
    category:string;
    latitude:number;
    longitude:number;
    comment:string;
    score?:number;
    picture?:string;
};

export const LandmarkCategories = {
    Shop: "Shop",
    Bar: "Bar",
    Restaurant: "Restaurant",
    Sight: "Sight",
    Monument: "Monument",
    Entertainment: "Entertainment",
    Other: "Other",
};