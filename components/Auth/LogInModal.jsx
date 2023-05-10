import { Box, IconButton } from "@mui/material";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';

const LogInModal = ({setLogInFlag}) => {
    return (
        <section className="relative h-screen w-screen flex flex-col items-center justify-center">
            <div className="fixed top-[10%] h-[80vh] left-[20%] w-[60vw] flex flex-col items-center bg-dokuso-white shadow-2xl rounded-3xl p-1">
                <div className="flex flex-col items-end justify-center h-12 w-full flex-none">
                    <IconButton sx={{marginRight: '4px'}} onClick={() => setLogInFlag(false)}>
                        <CloseIcon/>
                    </IconButton>
                </div>
                <div className="w-full h-full p-2">
                    <section className="w-full h-full border border-dokuso-black rounded-xl flex flex-col items-center justify-center">
                        Log in section
                    </section>
                </div>
            </div>
        </section>
    )
};

export default LogInModal;