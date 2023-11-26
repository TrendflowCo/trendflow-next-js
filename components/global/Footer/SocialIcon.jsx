import Image from "next/image";
import React from "react";

const SocialIcon = ({src,alt}) => {
    return <Image src={src} alt={alt} width={20} height={20}/>
};

export default SocialIcon