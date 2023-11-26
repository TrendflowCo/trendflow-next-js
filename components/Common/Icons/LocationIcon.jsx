import Image from "next/image";
import React from "react";
import locationIcon from "../../../public/locationIcon.svg";

const LocationIcon = () => {
    return (
        <Image
            src={locationIcon}
            width={15}
            height={20}
            alt="location"
        />
    )
}

export default LocationIcon;