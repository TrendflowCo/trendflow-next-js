import Typography from '@mui/material/Typography';
import React from "react";
import { useAppSelector } from "../../../../redux/hooks"
import { useRouter } from "next/router";

const TitleMobile = () => {
    const router = useRouter();
    const { language , country } = useAppSelector(state => state.region);
    return (
        <section>
            {!router.pathname.includes('results') && 
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href={`/${country}/${language}`}
                    sx={{
                    mr: 2,
                    display: { xs: 'flex', md: 'none' },
                    flexGrow: 1,
                    fontWeight: 700,
                    color: 'inherit',
                    textDecoration: 'none',
                    }}
                >
                    TrendFlow
                </Typography>
            }
        </section>
    )
};

export default TitleMobile;