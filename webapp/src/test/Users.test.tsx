import {
    render
} from "@testing-library/react";
import Users from "../pages/users/Users";
import assert from "assert";

test("Check the users page loads", () => {
    const{container} = render(<Users />);
    let title : HTMLHeadingElement = container.querySelector("h1") as HTMLHeadingElement;
    assert(title != null);
    expect(title).toBeInTheDocument();
    assert((title.textContent as string).trim() === "Users Found:");
});

test("Check the div with the main container is loaded", () => {
    const{container} = render(<Users />);
    expect(container.querySelector(".main-container")).toBeInTheDocument();
});

test("Check the div with the list of users is loaded", () => {
    const{container} = render(<Users />);
    expect(container.querySelector(".listUsers")).toBeInTheDocument();
});