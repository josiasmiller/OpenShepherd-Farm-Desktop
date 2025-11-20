import React from "react";
import { Box, Typography } from "@mui/material";

interface DateDisplayProps {
  title: string;
  value?: string | null;
}

/**
 * Displays a labeled date/value in a styled box.
 */
export const DateDisplay: React.FC<DateDisplayProps> = ({ title, value }) => {
  return (
    <Box flex={1}>
      <Typography
        variant="subtitle2"
        fontWeight="bold"
        gutterBottom
        fontFamily="Roboto Mono Bold"
      >
        {title}
      </Typography>
      <Box
        sx={{
          padding: "0.6em 1em",
          backgroundColor: "var(--md-sys-color-surface-container-low)",
          border: "1px solid var(--md-sys-color-outline-variant)",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="body2"
          fontFamily="Roboto Mono"
          color={value ? "text.primary" : "text.secondary"}
        >
          {value || "—"}
        </Typography>
      </Box>
    </Box>
  );
};
