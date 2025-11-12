import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
// import log from "electron-log";

import { Owner, OwnerType, Contact, Company } from "packages/api";
import { unwrapOrThrow } from "packages/core";

/**
 * Local display shape for normalized owner info.
 */
export type OwnerInfo = {
  id: string;
  type: OwnerType;
  name: string;
  flockId: string;
  phoneNumber: string;
  scrapieId?: string | null;
  premise: string;
};

export interface OwnerInformationTableProps {
  /** Array of owners to display, including type */
  owners: { ownerId: string; ownerType: OwnerType }[];
}

/**
 * Displays a table of owner information.
 * Fetches details via window.ownerAPI.getOwnerById for each owner.
 */
export const OwnerInformationTable: React.FC<OwnerInformationTableProps> = ({
  owners,
}) => {
  const [ownerData, setOwnerData] = useState<OwnerInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!owners || owners.length === 0) {
      setOwnerData([]);
      return;
    }

    const fetchOwnerData = async () => {
      try {
        setLoading(true);
        const collected: OwnerInfo[] = [];

        for (const { ownerId, ownerType } of owners) {
          // unwrapOrThrow will throw if the result is a Failure
          const result: Owner = await unwrapOrThrow(
            window.lookupAPI.getOwnerById(ownerId, ownerType)
          );

          let displayName: string;
          if (result.type === OwnerType.CONTACT) {
            const c: Contact = result.contact;
            displayName = `${c.firstName} ${c.lastName}`;
          } else {
            const co: Company = result.company;
            displayName = co.name;
          }

          collected.push({
            id: result.type === OwnerType.CONTACT ? result.contact.id : result.company.id,
            type: result.type,
            name: displayName,
            flockId: result.flockId ?? "—",
            phoneNumber: result.phoneNumber ?? "—",
            scrapieId: result.scrapieId?.scrapieName ?? "—", // TODO --> verify this is correct
            premise: result.premise.address ?? "—", // TODO --> verify this is correct
          });
        }

        // Deduplicate by ID
        const unique = new Map(collected.map((o) => [o.id, o]));
        setOwnerData(Array.from(unique.values()));
      } catch (err: any) {
        // log.error("Error fetching owner data:", err?.message);
        console.error("Error fetching owner data:", err?.message);
        await Swal.fire({
          icon: "error",
          title: "Failed to Load Owner Info",
          text: err?.message ?? "Unknown error while fetching owner data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, [owners]);

  return (
    <div className="results-section">
      <table className="results-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Membership Number</th>
            <th>Phone</th>
            <th>Scrapie Flock ID</th>
            <th>Premise</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "1.5em" }}>
                Loading...
              </td>
            </tr>
          ) : ownerData.length > 0 ? (
            ownerData.map((owner) => (
              <tr key={owner.id}>
                <td>{owner.name}</td>
                <td>{owner.flockId}</td>
                <td>{owner.phoneNumber}</td>
                <td>{owner.scrapieId ?? "—"}</td>
                <td>{owner.premise}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "1.5em" }}>
                No owner data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
