import React from "react";
import { Button, ButtonProps } from "@mui/material";

interface ActionButtonProps extends ButtonProps {
    label: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  sx,
  ...props
}) => {
    return (
        <Button
            sx={{
                color: "white",
                backgroundColor: "primary.main",
                fontWeight: "bold",
                fontSize: "1.1rem",
                boxShadow: 3,
                borderRadius: 2,
                px: 3,
                py: 1.5,
                '&:hover': {
                    backgroundColor: "primary.dark",
                    boxShadow: 6,
                },
                '&:disabled': {
                    backgroundColor: "grey.400",
                    color: "grey.200",
                    boxShadow: "none",
                },
                ...sx,
            }}
            {...props}
        >
            {label}
        </Button>
    );
};

export default ActionButton;
