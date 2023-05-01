import {
    render
} from "@testing-library/react";
import Home from "../pages/home/Home";
import assert from "assert";

test("Check the text of the page is correctly rendered", () => {
    const{container} = render(<Home />);
    let title : HTMLHeadingElement = container.querySelector("h1") as HTMLHeadingElement;
    assert(title != null);
    expect(title).toBeInTheDocument();
    assert((title.textContent as string).trim() === "Home");
});

test("Check the map is rendered", () => {
    const{container} = render(<Home />);
    expect(container.querySelector(".homeContainer > div[class*='leaflet']")).toBeInTheDocument();
});