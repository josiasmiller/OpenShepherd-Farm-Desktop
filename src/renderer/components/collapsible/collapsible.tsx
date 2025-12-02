import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Collapse,
} from "@mui/material";

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <Box
      sx={{
        borderRadius: 1,
        backgroundColor: "background.paper",
        boxShadow: 1,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        onClick={onToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          cursor: "pointer",
          "&:hover": { backgroundColor: "action.hover" },
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton size="small" aria-label={isOpen ? "Collapse" : "Expand"}>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </IconButton>
      </Box>

      <Divider />

      {/* Collapsible Content */}
      <Collapse in={isOpen} timeout={50}>
        <Box sx={{ px: 2, py: 1 }}>{children}</Box>
      </Collapse>
    </Box>
  );
};

export default CollapsibleSection;
