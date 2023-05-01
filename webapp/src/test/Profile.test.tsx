import {
    render
} from "@testing-library/react";
import Profile from "../pages/profile/Profile";

test("Check the profile page loads", () => {
    const{container} = render (<Profile/>)
    expect(container.querySelector(".profile")).toBeInTheDocument();
});

test("Check the user's profile picture is loaded", () => {
    const{container} = render (<Profile/>)
    expect(container.querySelector(".profileUserImg")).toBeInTheDocument();
});

test("Check the user's name is loaded", () => {
    const{container} = render (<Profile/>)
    expect(container.querySelector(".profileInfoName")).toBeInTheDocument();
});

test("Check the div with the addFriend button or text is loaded", () => {
    const{container} = render (<Profile/>)
    expect(container.querySelector(".profileRightBottom")).toBeInTheDocument();
});