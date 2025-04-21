import React from "react";
import { render, screen } from "@testing-library/react";
import Sidebar from "./sidebar";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom'; 

describe("Sidebar", () => {
  test("renders sidebar title and database button", async () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
  
    expect(await screen.findByText("AnimalTrakker Farm Desktop")).toBeInTheDocument();
    expect(await screen.findByText("Select Database")).toBeInTheDocument();
  });
});
