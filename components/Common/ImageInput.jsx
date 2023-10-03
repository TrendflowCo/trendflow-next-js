import React from "react";

const StammImageInput = ({labelText , widths , value , onChange , placeholder , id}) => {
    return (
        <div className={`flex flex-col xl:first:ml-0 xl:last:mr-0 xl:mx-2 mt-4 ${widths}`}>
            <span className='text-black text-sm font-semibold underline'>{labelText}</span>
            <label htmlFor={`dropzone-file-${id}`} className={`mt-2.5 flex flex-row h-11.5 border border-stamm-black rounded-full`}>
                <div 
                    className='w-full flex flex-row items-center justify-between px-4 bg-transparent' 
                >
                    {value === '' ? <span className='text-gray-400 text-sm'>{placeholder}</span> : <span>{value}</span>}
                </div>
                <input type="file" id={`dropzone-file-${id}`} onChange={onChange} className='hidden'/>
            </label>
        </div>
    )
};

export default StammImageInput;