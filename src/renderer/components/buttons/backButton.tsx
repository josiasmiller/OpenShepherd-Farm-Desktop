import React from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const BackButton: React.FC = () => {
    const navigate = useNavigate();

    return (
        <IconButton
            onClick={() => navigate(-1)}
            size="small"
            title="Go Back"
            sx={{ p: 0.5 }}
        >
            <ArrowBackIcon />
        </IconButton>
    );
};
