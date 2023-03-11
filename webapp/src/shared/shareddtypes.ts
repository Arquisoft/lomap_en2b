export type User = {
    name:string;
    email:string;
    friends?:User[];
    landmarks?:Landmark[];
  };

export type Landmark = {
    name:string;
    category:string;
    latitude:number;
    longitude:number;
    score?:number;
    comment?:string;
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