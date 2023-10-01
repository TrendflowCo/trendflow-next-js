import React from "react";

const StammInput = ({labelText , widths , type , value , onChange , placeholder}) => {
    return (
        <div className={`flex flex-col mx-4 first:ml-0 last:mr-0 mt-4 ${widths}`}>
            <label className="font-semibold mb-2">{labelText}</label>
            <input 
                type={type} 
                className="h-10 w-full border border-dokuso-black rounded bg-transparent px-4 text-sm" value={value} 
                onChange={(e) => {onChange(e)}}
                placeholder={placeholder}
            />
        </div>
    )
};

export default StammInput;