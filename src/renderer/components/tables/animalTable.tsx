import React, { useEffect, useState } from "react";
// import log from 'electron-log';
import Swal from "sweetalert2";

import { handleResult, Result } from "packages/core";
import { AnimalBasicInfo } from "packages/api";

/**
 * Local display shape for normalized animal info.
 */
export type AnimalInfo = {
  id: string;
  flockPrefix: string;
  name: string;
  registrationNumber: string;
  birthDate: string; // formatted date
  coatColor?: string; // optional placeholder
};

interface AnimalInformationTableProps {
  /** A list of animal UUIDs to look up and display. */
  animalIds: string[];
}

/**
 * Displays a simple table of animal information.
 * Fetches details via window.animalAPI.getAnimalTableInfo(animalIds)
 * and maps DB rows into display-friendly data.
 */
export const AnimalInformationTable: React.FC<AnimalInformationTableProps> = ({
  animalIds,
}) => {
  const [animalData, setAnimalData] = useState<AnimalInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!animalIds || animalIds.length === 0) {
      setAnimalData([]);
      return;
    }

    const fetchAnimalData = async () => {
      try {
        setLoading(true);

        let basicAnimalResult: Result<AnimalBasicInfo[], string> = await window.animalAPI.getBasicAnimalInfo(animalIds);
        let animalBasicInfo: AnimalBasicInfo[] = [];

        await handleResult(basicAnimalResult, {
          success: (data: AnimalBasicInfo[]) => {
            animalBasicInfo = data;
          },
          error: (err: string) => {
            console.error("Failed to get animalBasicInfo: ", err);
            throw new Error(err);
          },
        });

        // Normalize DB response into display shape
        const normalized: AnimalInfo[] = animalBasicInfo.map((a) => ({
          id: a.animalId,
          flockPrefix: a.flockPrefix ?? "—",
          name: a.name ?? "—",
          registrationNumber: a.registrationNumber ?? "—",
          birthDate: a.birthDate
            ? new Date(a.birthDate).toLocaleDateString()
            : "—",
          coatColor: a.coatColor ?? "—",
        }));

        // Deduplicate by ID (in case duplicates returned)
        const unique = new Map(normalized.map((a) => [a.id, a]));
        setAnimalData(Array.from(unique.values()));
      } catch (err: any) {
        // log.error("Error fetching animal data:", err?.message);
        console.error("Error fetching animal data:", err?.message);
        await Swal.fire({
          icon: "error",
          title: "Failed to Load Animal Info",
          text: err?.message ?? "Unknown error while fetching animal data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnimalData();
  }, [animalIds]);

  return (
    <div className="results-section">
      <table className="results-table">
        <thead>
          <tr>
            <th>Flock Prefix</th>
            <th>Animal Name</th>
            <th>Registration Number</th>
            <th>Birth Date</th>
            <th>Coat Color</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "1.5em" }}>
                Loading...
              </td>
            </tr>
          ) : animalData.length > 0 ? (
            animalData.map((animal) => (
              <tr key={animal.id}>
                <td>{animal.flockPrefix}</td>
                <td>{animal.name}</td>
                <td>{animal.registrationNumber}</td>
                <td>{animal.birthDate}</td>
                <td>{animal.coatColor ?? "—"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "1.5em" }}>
                No animal data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
