import React from "react";
import { useAppSelector } from "../../redux/hooks";

const FashionForward = () => {
    const { translations } = useAppSelector(state => state.language);
    return (
        // <div className="flex flex-col items-center w-full pt-16 text-dokuso-black">
        //     <div className="flex flex-col max-w-xl w-full items-start">
        //         <h1 className="text-dokuso-black text-2xl sm:text-3xl font-bold mb-3">
        //             {translations?.features?.title}
        //         </h1>
        //         <p className="py-4 sm:text-xl text-lg">{translations?.features?.text}</p>
        //     </div>
        // </div>
        <div className="flex flex-col items-center w-full pt-8 text-dokuso-black">
        <div className="flex flex-col max-w-[50%] w-full items-start">
            <h1 className="text-dokuso-black text-2xl sm:text-3xl font-bold mb-3">
                {translations?.features?.title}
            </h1>
            <p className="py-4 sm:text-xl text-lg">{translations?.features?.text}</p>
        </div>
    </div>
    
    )
};

export default FashionForward;