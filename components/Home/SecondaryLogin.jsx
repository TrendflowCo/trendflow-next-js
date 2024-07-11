import React from "react";
import { Button } from "@mui/material";
import { useAppSelector , useAppDispatch } from "../../redux/hooks";
import { setLogInFlag } from "../../redux/features/actions/auth";

const SecondaryLogin = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { translations } = useAppSelector(state => state.region);
    return (
        <div className="w-full flex flex-col items-center justify-center">
            {/* Show this only if no user is logged */}
            {!user && 
                <div className='max-w-xl md:max-w-xl px-1 max-w-xl md:max-w-xl mx-auto mt-10 mb-10'>
                    <p className="sm:text-xl text-lg px-3 text-trendflow-black">{translations?.action}</p>

                    <div className="flex flex-col items-center">
                        <Button 
                            onClick={() => {dispatch(setLogInFlag(true))}}
                            className="text-trendflow-black font-semibold hover:text-trendflow-white bg-gradient-to-r from-trendflow-green mt-4 to-trendflow-blue hover:from-trendflow-pink hover:to-trendflow-orange" variant="contained" 
                        >
                            <p className="sm:text-lg text-base">{translations?.login?.log_in}</p>
                        </Button>
                    </div>
                </div>
            }
        </div>
    )
};

export default SecondaryLogin;