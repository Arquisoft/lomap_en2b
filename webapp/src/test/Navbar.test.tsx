import {
    render
} from "@testing-library/react";
import Navbar from "../components/navbar/Navbar";

test("Check the elements of the navbar are correctly rendered", () => {
    const{container} = render(<Navbar />);
    expect(container.querySelector("#logoLinkNB")).toBeInTheDocument();
    expect(container.querySelector("#logoImgNB")).toBeInTheDocument();
    expect(container.querySelector("#searchIconNB")).toBeInTheDocument();
    expect(container.querySelector("#searchInputNB")).toBeInTheDocument();
    expect(container.querySelector("#submitButtonNB")).toBeInTheDocument();
    expect(container.querySelector("#rightPaneNB")).toBeInTheDocument();
});