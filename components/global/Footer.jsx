import React from "react";
import { Typography , IconButton, createTheme , ThemeProvider, Tooltip } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
    const socialMedia = [
        {
            name: "facebook",
            ref: "https://www.facebook.com/Dokuso.App"
        },
        {
            name: "twitter",
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
    const theme = createTheme({
        palette: {
            facebook: {
                main: "#3b5998"
            },
            twitter: {
                main: "#00acee"
            },
            instagram: {
                main: "#833AB4"
            },
            linkedin: {
                main: "#0e76a8"
            },
        },  
    });

    return (
        <section className='flex flex-col items-center bg-dokuso-black bg-opacity-20 w-full'>
            <div className='flex flex-row justify-center w-full max-w-xl pt-4'>
                <ThemeProvider theme={theme}>
                    {socialMedia.map((itemMedia , indexMedia) => {return (
                        <Tooltip key={indexMedia} title={itemMedia.name.charAt(0).toUpperCase() + itemMedia.name.slice(1)}>
                            <Link 
                                href={itemMedia.ref} 
                                target="_blank"
                            >
                                <IconButton
                                    color={itemMedia.name}
                                    sx={{'marginInline': '4px'}}
                                >
                                    {itemMedia.name === "facebook" && <FacebookIcon/>}
                                    {itemMedia.name === "twitter" && <TwitterIcon/>}
                                    {itemMedia.name === "instagram" && <InstagramIcon/>}
                                    {itemMedia.name === "linkedin" && <LinkedInIcon/>}
                                </IconButton>
                            </Link>
                        </Tooltip>
                    )})}
                </ThemeProvider>
            </div>
            {/* <div className="mt-4">
                <Link 
                    href="https://www.producthunt.com/posts/dokuso?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-dokuso"
                    target="_blank"
                >
                <Image 
                    src={"https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=380926&theme=light"} 
                    width={250} 
                    height={54} 
                    alt={`Dokuso - AI&#0045;powered&#0032;search&#0032;engine&#0032;revolutionizing&#0032;fashion&#0032;industry&#0046; | Product Hunt`}
                />
                </Link>
            </div> */}
            <div className='text-center text-dokuso-black py-4'>
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