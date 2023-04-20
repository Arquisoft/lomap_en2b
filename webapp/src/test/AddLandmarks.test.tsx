import {
    screen,
    render,
    fireEvent
} from "@testing-library/react";
import AddLandmarks from "../pages/addLandmark/AddLandmark"
import {Landmark} from '../shared/shareddtypes';
import assert from "assert";

test("Check all the landmark types are rendered", () => {
    const {container} = render(<AddLandmarks/>)
    let values: string[] = Object.values(Landmark);
    let renderedValues: string[] = Array.from(container.querySelectorAll("option")).map(elem => elem.toString());

    expect(renderedValues.length === values.length).toBeTruthy();
    for (let i: number = 0; i < values.length; i++) {
        expect(renderedValues[i] === values[i]).toBeTruthy();
    }
});

test("Check the different containers are rendered", () => {
    const {container} = render(<AddLandmarks />);
    expect(container.querySelector("h1")).toBeInTheDocument();
    expect(screen.getByText("Add a landmark")).toBeInTheDocument();
    expect(container.querySelector("div[class*='leftPane']")).toBeInTheDocument();
    expect(container.querySelector("div[class*='rightPane']")).toBeInTheDocument();
});

test("Check the map is rendered in the right panel, and it does not contain any mark", () => {
    const {container} = render(<AddLandmarks />);
    expect(container.querySelector("div[class*='rightPane'] > div")).toBeInTheDocument();
    expect(container.querySelector("img[alt='Marker']")).not.toBeInTheDocument();
});

test("Check the map is rendered in the right panel, and it does not contain any mark", () => {
    const {container} = render(<AddLandmarks />);
    expect(container.querySelector("div[class*='rightPane'] > div")).toBeInTheDocument();
});

test("Check the form is rendered in the left panel", () => {
    const {container} = render(<AddLandmarks />);
    expect(container.querySelector("div[class*='leftPane'] > form")).toBeInTheDocument();
    expect(screen.getByText("Name of the landmark")).toBeInTheDocument();
    expect(container.querySelector("input[class*='MuiSelect']")).toBeInTheDocument();

    expect(screen.getByText("Latitude:")).toBeInTheDocument();
    expect(screen.getByText("Longitude:")).toBeInTheDocument();
    expect(container.querySelector("button[class*='MuiButton']")).not.toBeInTheDocument();
});

test("Check that, when clicking the map, a marker appears", () => {
    const {container} = render(<AddLandmarks />);
    let mapContainer = container.querySelector("div[class*='rightPane'] > div");
    assert(mapContainer !== null);
    expect(container.querySelector("img[alt='Marker']")).not.toBeInTheDocument();
    fireEvent(mapContainer, new MouseEvent('click'));
    expect(container.querySelector("img[alt='Marker']")).toBeInTheDocument();
    assert(container.querySelector("#latitude")?.textContent != "");
    assert(container.querySelector("#longitude")?.textContent != "");
    expect(container.querySelector("button[class*='MuiButton']")).toBeVisible();
});