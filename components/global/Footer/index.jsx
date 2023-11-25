import React from "react";
import { Typography , IconButton, Tooltip } from "@mui/material";
import Link from "next/link";
import PagesDesktop from "./Pages";
import { useRouter } from "next/router";
import { useAppSelector } from "../../../redux/hooks";
import instagramIcon from "../../../public/instagramNew.svg";
import linkedinIcon from "../../../public/linkedInNew.svg";
import facebookIcon from "../../../public/facebookNew.svg";
import xTwitterIcon from "../../../public/xTwitterNew.svg";
import SocialIcon from "./SocialIcon";

const Footer = () => {
    const router = useRouter();
    const { country , language } = useAppSelector(state => state.region)
    const handleSelectPage = (sel) => { // funcion para seleccionar paginas. Queda para los dos formatos
        if(sel === 'home') {
          router.push(`/${country}/${language}`)
        } else if (sel === 'blog'){
          router.push(`/${country}/${language}/blog`)
        } else if (sel === 'brands') {
          router.push(`/${country}/${language}/brands`)
        }
      };
    
    const socialMedia = [
        {
            name: "facebook",
            ref: "https://www.facebook.com/Dokuso.App"
        },
        {
            name: "x",
            ref: "https://twitter.com/DokusoApp"
        },
        {
            name: "instagram",
            ref: "https://www.instagram.com/Dokuso.App"
        },
        {
            name: "linkedin",
            ref: "https://www.linkedin.com/company/Dokuso"
        },
    ];

    return (
        <section className='flex flex-col items-center bg-dokuso-black bg-opacity-20 w-full h-fit'>
            <div className='flex flex-row justify-center w-full max-w-[80%] pt-4'>
                <PagesDesktop handleSelectPage={handleSelectPage}/>
            </div>
            <div className="flex flex-row w-full max-w-[80%] mx-auto mt-2">
                {socialMedia.map((itemMedia , indexMedia) => {return (
                    <div className="mx-1 first:ml-0 last:mr-0">
                        <Tooltip key={indexMedia} placement="top" arrow title={itemMedia.name.charAt(0).toUpperCase() + itemMedia.name.slice(1)}>
                            <Link 
                                href={itemMedia.ref} 
                                target="_blank"
                            >
                                <IconButton
                                    color={itemMedia.name}
                                >
                                    {itemMedia.name === "facebook" && <SocialIcon src={facebookIcon} alt="facebook"/>}
                                    {itemMedia.name === "x" && <SocialIcon src={xTwitterIcon} alt="xTwitter"/>}
                                    {itemMedia.name === "instagram" && <SocialIcon src={instagramIcon} alt="instagram"/>}
                                    {itemMedia.name === "linkedin" && <SocialIcon src={linkedinIcon} alt="linkedin"/>}
                                </IconButton>
                            </Link>
                        </Tooltip>
                    </div>
                )})}
            </div>
            <div className='w-full max-w-[80%] mx-auto text-start text-dokuso-black mt-2 pb-4'>
                <Typography variant="body2" color="text.secondary">
                {'Copyright © '}
                <Link color="inherit" href="https:/dokuso.app/">
                    Dokuso
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
                </Typography>
            </div>
        </section>
    );
};

export default Footer;