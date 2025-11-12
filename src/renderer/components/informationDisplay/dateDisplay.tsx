import React from "react";

interface DateDisplayProps {
  title: string;
  value?: string | null;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({ title, value }) => {
  return (
    <div style={{ flex: 1 }}>
      <label
        style={{
          fontWeight: "bold",
          display: "block",
          marginBottom: "0.3em",
        }}
      >
        {title}
      </label>
      <div
        style={{
          padding: "0.6em 1em",
          backgroundColor: "#f9f9f9",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        {value || "—"}
      </div>
    </div>
  );
};
