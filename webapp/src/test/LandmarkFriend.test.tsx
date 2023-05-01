import {
    render
} from "@testing-library/react";
import LandmarkFriend from "../pages/otherUsersLandmark/LandmarkFriend";
import assert from "assert";

test("Check the landmarkFriend page loads", () => {
    const{container} = render (<LandmarkFriend/>)
    let title : HTMLHeadingElement = container.querySelector("h1") as HTMLHeadingElement;
    assert(title != null);
    expect(title).toBeInTheDocument();
    assert((title.textContent as string).trim() === "See friends' landmarks");
});