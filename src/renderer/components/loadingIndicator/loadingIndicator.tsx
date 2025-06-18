import React from "react";

interface LoadingIndicatorProps {
  isLoading: boolean;
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  isLoading,
  message = "Loading...",
}) => {
  if (!isLoading) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "rgba(0,0,0,0.75)",
        color: "#fff",
        padding: "12px 18px",
        borderRadius: "8px",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div className="spinner" />
      <span>{message}</span>
    </div>
  );
};

export default LoadingIndicator;
