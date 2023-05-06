import React from "react";
import { Button } from "@mui/material";

const SecondaryLogin = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center">
            {/* For now, without log in method, put it as true */}
            {/* {!user &&  */}
            {true && 
                <div className='max-w-xl md:max-w-xl px-1 max-w-xl md:max-w-xl mx-auto mt-10 mb-10'>
                    <p className="sm:text-xl text-lg px-3 text-dokuso-black">Join the revolution today and experience the power of Dokuso.</p>

                    <div className="flex flex-col items-center">
                        <Button 
                            // onClick={handleModal}
                            className="text-dokuso-black hover:text-dokuso-white bg-gradient-to-r from-dokuso-green mt-4 to-dokuso-blue hover:from-dokuso-pink hover:to-dokuso-orange" variant="contained" 
                            // color="primary"
                        >
                            <p className="sm:text-lg text-base">Sign Up</p>
                        </Button>
                    </div>
                </div>
            }
        </div>
    )
};

export default SecondaryLogin;