import {
    render
} from "@testing-library/react";
import Login from "../pages/login/Login";
import assert from "assert";

// Axios printsq an error, but otherwise the tests pass

test("Check the text of the page is correctly rendered", () => {
    const{container, getByText} = render(<Login />);
    let title : HTMLHeadingElement = container.querySelector("h1") as HTMLHeadingElement;
    assert(title != null);
    expect(title).toBeInTheDocument();
    assert((title.textContent as string).trim() === "Login");
    expect(getByText("Welcome to LoMap!")).toBeInTheDocument();
    expect(getByText("This application runs using the solid principles, this means, you need an account on a pod provider to use it.")).toBeInTheDocument();
    expect(getByText("If you already have one, please log in.")).toBeInTheDocument();
    expect(getByText("If not, please create an account in a pod provider as inrupt.net")).toBeInTheDocument();
    assert(container.querySelectorAll("p").length === 4);
});

test("Check the input box of the page is correctly rendered", () => {
    const{container} = render(<Login />);
    expect(container.querySelector("button")).toBeInTheDocument();
    expect(container.querySelector("input")).toBeInTheDocument();
    assert(container.querySelector("input")?.value === "https://inrupt.net");
});