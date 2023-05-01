import { Landmark, Review } from '../shared/shareddtypes';
import assert from "assert";

test("LandmarkClassIsCorrect", () => {
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