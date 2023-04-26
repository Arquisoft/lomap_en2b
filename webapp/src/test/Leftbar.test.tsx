import {
    render
} from "@testing-library/react";
import Leftbar from "../components/leftBar/LeftBar";

test("Check the links of the leftbar are correctly rendered", () => {
    const{container} = render(<Leftbar />);
    expect(container.querySelector("#addlandmarkLB")).toBeInTheDocument();
    expect(container.querySelector("#seelandmarksLB")).toBeInTheDocument();
    expect(container.querySelector("#profileLB")).toBeInTheDocument();
    expect(container.querySelector("#friendsLB")).toBeInTheDocument();
});