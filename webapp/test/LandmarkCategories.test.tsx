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
});