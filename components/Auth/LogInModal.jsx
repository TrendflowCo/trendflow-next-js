import { Box } from "@mui/material";
import React from "react";

const LogInModal = ({setLogInFlag}) => {
    return (
        <section className="fixed z-100 bg-dokuso-black bg-opacity-10 w-screen h-screen">
            <Box sx={{
                maxWidth: 480,
                minHeight: 600,
                padding: 25,
                margin: "auto",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                background: "#fff",              
            }}>
                <div>
                    <button onClick={() => setLogInFlag(false)}>Close</button>
                </div>
            </Box>
        </section>
    )
};

export default LogInModal;