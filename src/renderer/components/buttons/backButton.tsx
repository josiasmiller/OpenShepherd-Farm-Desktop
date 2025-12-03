import React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface BackButtonProps {
    onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
    return (
        <IconButton
            onClick={onClick}
            size="small"
            title="Go Back"
            sx={{ p: 0.5 }}
        >
            <ArrowBackIcon />
        </IconButton>
    );
};
