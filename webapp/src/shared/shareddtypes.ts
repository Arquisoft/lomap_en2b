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
    description?:string;
    reviews?:Array<Review>;
    scores?:Map<string,Number>;
    pictures?:string[];
    url?:string;
    constructor(name:string, category:string, latitude:number, longitude:number, description:string, reviews?:Array<Review>, scores?:Map<string,Number>, pictures?:string[], url?:string){
        this.name = name;
        this.category = category;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.reviews = reviews;
        this.scores = scores;
        this.pictures = pictures;
        this.url = url;
    }
};

export class Review {
    webId:string;
    date: string;
    username:string;
    title:string;
    content:string;

    constructor(webId:string, date:string, username:string, title:string, content:string){
        this.webId = webId;
        this.date = date;
        this.username = username;
        this.title = title;
        this.content = content;
    }
}

export const LandmarkCategories = {
    Shop: "Shop",
    Bar: "Bar",
    Restaurant: "Restaurant",
    Sight: "Sight",
    Monument: "Monument",
    Entertainment: "Entertainment",
    Other: "Other",
};
