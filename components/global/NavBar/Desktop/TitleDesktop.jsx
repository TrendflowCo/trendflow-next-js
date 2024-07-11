import Typography from '@mui/material/Typography';
import React from "react";
import { useAppSelector } from "../../../../redux/hooks"

const TitleDesktop = () => {
    const { language , country } = useAppSelector(state => state.region);
    return (
        <section className="mr-2 hidden md:flex">
            <Typography
                variant="h6"
                noWrap
                component="a"
                href={`/${country}/${language}`}
                sx={{
                    fontWeight: 700,
                    color: 'trendflowBlack',
                    textDecoration: 'none',
                }}
            >
                TrendFlow
            </Typography>

        </section>
    )
};

export default TitleDesktop;