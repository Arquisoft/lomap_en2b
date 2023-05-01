import {
    render
} from "@testing-library/react";
import Friends from "../pages/friends/Friends";
import assert from "assert";

test("Check the friends page loads", () => {
    const{container} = render(<Friends />);
    let title : HTMLHeadingElement = container.querySelector("h1") as HTMLHeadingElement;
    assert(title != null);
    expect(title).toBeInTheDocument();
    assert((title.textContent as string).trim() === "Your friends:");
});

test("Check the div with the main container is loaded", () => {
    const{container} = render(<Friends />);
    expect(container.querySelector(".friendsContainer")).toBeInTheDocument();
});

test("Check the div with the list of users is loaded", () => {
    const{container} = render(<Friends />);
    expect(container.querySelector(".friendList")).toBeInTheDocument();
});