export type User = {
    solidURL:string;
    username:string;
    email:string;
    _id:string;
    landmarks?:Landmark[];
  };

export class Landmark  {
    name:string;
    category:string;
    latitude:number;
    longitude:number;
    comment?:string;
    score?:number;
    picture?:string;
    constructor(title:string, latitude:number, longitude:number, category:string, comment?:string, score?:number, picture?:string){
        this.name = title;
        this.category = category;
        this.latitude = latitude;
        this.longitude = longitude;
        this.comment = comment;
        this.score = score;
        this.picture = picture;
    }
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