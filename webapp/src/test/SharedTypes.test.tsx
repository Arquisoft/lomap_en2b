import { Landmark, Review } from '../shared/shareddtypes';
import assert from "assert";

test("LandmarkClassIsCorrect", () => {
    let id : number = 1;
    let name : string = "TestName";
    let category : string = "TestCategory";
    let latitude : number = -5.72;
    let longitude : number = 5.33;
    let description : string = "TestDescription";
    let pictures : string[] = ["TestPictures"];
    let reviews : Review[] = [];
    let scores : Map<string, number> = new Map<string, number>();
    let url : string = "TestUrl";

    
    let landmark : Landmark = {
        id : id,
        name : name,
        category : category,
        latitude : latitude,
        longitude : longitude,
        description : description,
        reviews : reviews,
        pictures : pictures,
        scores : scores,
        url: url
    }

    assert(landmark.id == 1);
    assert(landmark.name == "TestName");
    assert(landmark.category == "TestCategory");
    assert(landmark.latitude == -5.72);
    assert(landmark.longitude == 5.33);
    assert(landmark.description == "TestDescription");
    expect(landmark.pictures).toBeTruthy();
    expect(landmark.reviews).toBeTruthy();
    expect(landmark.scores).toBeTruthy();
    assert(landmark.url == "TestUrl");
});

test("LandmarkClassIsCorrectPartialConstructor", () => {
    let name : string = "TestName";
    let category : string = "TestCategory";
    let latitude : number = -5.72;
    let longitude : number = 5.33;
    let url : string = "TestUrl";

    
    let landmark : Landmark = {
        name : name,
        category : category,
        latitude : latitude,
        longitude : longitude,
        url: url
    }

    assert(landmark.name == "TestName");
    assert(landmark.category == "TestCategory");
    assert(landmark.latitude == -5.72);
    assert(landmark.longitude == 5.33);
    expect(landmark.description).toBeFalsy();
    expect(landmark.pictures).toBeFalsy();
    expect(landmark.reviews).toBeFalsy();
    expect(landmark.scores).toBeFalsy();
    assert(landmark.url == "TestUrl");
});


test("ReviewClassIsCorrect", () => {
    let webId : string = "TestWebId";
    let date : string = "TestDate";
    let username : string = "TestUsername";
    let title : string = "TestTitle";
    let content : string = "TestContent";

    let review : Review = {
        webId : webId,
        date : date,
        username : username,
        title : title,
        content : content
    }

    assert(review.webId == "TestWebId");
    assert(review.date == "TestDate");
    assert(review.username == "TestUsername");
    assert(review.title == "TestTitle");
    assert(review.content == "TestContent");
});
