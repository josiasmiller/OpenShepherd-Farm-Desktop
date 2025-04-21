# Mock Data Directory

This directory contains structured mock data used across tests.

Each file exports mock data for a specific type (e.g., `Owner`, `Breed`, `Company`) as defined in the shared database types. These mocks are imported into `jest.setup.ts` to simulate Electron API responses during testing.
