import React from "react";
import { pages } from "../../Utils/pages";
import { useAppSelector } from "../../../redux/hooks";

const PagesDesktop = ({handleSelectPage}) => {
    const {  translations  } = useAppSelector(state => state.region)
        
    return (
        <section className="w-full flex flex-row">
          {pages.map((page) => (
            <span
              key={page.name}
              onClick={() => {handleSelectPage(page.name)}}
              className="cursor-pointer first:ml-0 last:mr-0 mx-2.5 font-semibold hover:underline"
            >
              {translations?.[page.name]?.toUpperCase() || page.name?.toUpperCase()}
            </span>
          ))}

        </section>
    )
};

export default PagesDesktop;