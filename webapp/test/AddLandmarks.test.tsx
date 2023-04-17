import { render, fireEvent, act } from "@testing-library/react";
import AddLandmarks from "../src/pages/addLandmark/AddLandmark"
import {Landmark} from '../src/shared/shareddtypes';
jest.mock('../api/api');

test("Check all the landmark types are rendered", () => {
    const {getAllByTestId} = render(<AddLandmarks />)
    let values : string[] = Object.values(Landmark);
    let renderedValues : string[] = getAllByTestId("option-test").map(elem => elem.toString());

    expect(renderedValues.length === values.length).toBeTruthy();
    for (let i : number = 0; i < values.length; i++){
        expect(renderedValues[i] === values[i]).toBeTruthy();
    }
});

test("Check the form is correctly rendered", () => {
    const {getByTestId, getByText, getByLabelText} = render(<AddLandmarks />)
    expect(getByTestId("form-testid")).toBeInTheDocument();
    // First field group
    expect(getByTestId("firstField-testid")).toBeInTheDocument();
    expect(getByText("Name of the landmark")).toBeInTheDocument();
    expect(getByLabelText("Name of the landmark")).toBeInTheDocument();
    // Second field group
    expect(getByTestId("secondField-testid")).toBeInTheDocument();
    expect(getByText("Category of the landmark")).toBeInTheDocument();
    expect(getByLabelText("Category of the landmark")).toBeInTheDocument();
    // Third field group
    expect(getByTestId("thirdField-testid")).toBeInTheDocument();
    expect(getByText("Latitude")).toBeInTheDocument();
    expect(getByTestId("Latitude-test")).toBeInTheDocument();
    // Fourth field group
    expect(getByTestId("fourthField-testid")).toBeInTheDocument();
    expect(getByText("Longitude")).toBeInTheDocument();
    expect(getByTestId("Longitude-test")).toBeInTheDocument();
    // Button
    expect(getByText("Save new landmark")).toBeInTheDocument();
});

test("Check the map is rendered", () => {
    const {container} = render(<AddLandmarks />)
    expect(container.querySelector("div[class *= \"leaflet\"]")).toBeInTheDocument();
});

test("Check clicking in the map once generates a landmark", () => {
   const {container} = render(<AddLandmarks />);
   const mapElement = container.querySelector("div[class *= \"leaflet\"]");
   fireEvent.click(mapElement);
   expect(container.querySelector("img[alt='Marker']")).toBeInTheDocument();
});

test("Check clicking in the map twice does not generate a landmark", () => {
    const {container} = render(<AddLandmarks />);
    const mapElement = container.querySelector("div[class *= \"leaflet\"]");
    fireEvent.dblClick(mapElement);
    expect(container.querySelector("img[alt='Marker']")).not.toBeInTheDocument();
});

