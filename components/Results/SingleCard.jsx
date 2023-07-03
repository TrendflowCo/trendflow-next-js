import { CardMedia, IconButton } from "@mui/material";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector , useAppDispatch } from "../../redux/hooks";
import { setFocusedCard } from "../../redux/features/actions/search";
import { logos } from "../Utils/logos";
import Image from "next/image";


const SingleCard = () => {
    const dispatch = useAppDispatch();
    const { focusedCard } = useAppSelector(state => state.search);
    return (
        <>
            {focusedCard?.id && <div className="h-full w-full bg-dokuso-black absolute top-0 left-0 z-10 bg-opacity-30"></div>}
            <div className={`rounded-[16px] w-[80%] h-[85%] lg:w-[60%] self-center flex flex-col bg-dokuso-white border-l border-l-stamm-gray shadow-2xl fixed z-20 ease-in-out duration-500 ${focusedCard?.id ? 'shadow-[-10px_0px_30px_10px_rgba(0,0,0,0.3)] scale-100' : 'shadow-none scale-0'}`}>
                { focusedCard?.id && 
                    <>
                        <div className=" flex flex-row justify-end" >
                            <IconButton onClick={() => {dispatch(setFocusedCard({}))}}>
                                <CloseIcon fontSize="medium"/>
                            </IconButton>
                        </div>
                        <section className='flex flex-col w-full h-full'>
                            <div className='flex flex-row items-center justify-start w-full h-20 py-2 px-4'>
                                <div className='w-full h-full flex flex-col justify-center items-start'>
                                    <Image 
                                    src={logos[focusedCard?.brand?.toLowerCase()]} 
                                    alt={focusedCard?.brand} 
                                    height={0} 
                                    width={0} 
                                    sizes="100vw" 
                                    style={{height: '75%' , width: '35%' , objectFit: 'contain', alignSelf:'start' }}
                                    />
                                </div>
                            </div>
                            <div className="w-full flex flex-col items-center justify-start">
                                <CardMedia
                                    component="img"
                                    image={focusedCard.img_url}
                                    alt={focusedCard.name}
                                    sx={{ maxHeight: '50%' , maxWidth: '50%' , widows:'fit', height:'fit' , objectFit: 'scale-down' }}
                                />
                            </div>
                        </section>
                    </>
                }
            </div>
        </>
    )
};

export default SingleCard;