import {
    render
} from "@testing-library/react";
import App from "../App";

test("Check the app page loads", () => {
    const{container} = render (<App/>)
    expect(container.querySelector(".mainContainer")).toBeInTheDocument();
});