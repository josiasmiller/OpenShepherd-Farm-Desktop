import React from "react";
import { render, screen } from "@testing-library/react";
import CreateDefault from "./createDefault";
import '@testing-library/jest-dom'; 

describe("CreateDefault", () => {
  test("renders the create default form/page content", async () => {
    render(<CreateDefault />);

    expect(await screen.findByText("Create New Default")).toBeInTheDocument();
  });
});
