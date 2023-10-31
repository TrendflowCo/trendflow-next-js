import { Box } from "@mui/material";
import Typography from '@mui/material/Typography';
import React from "react";
import { useAppSelector } from "../../../../redux/hooks"

const TitleDesktop = () => {
    const { language , country } = useAppSelector(state => state.region);
    return (
        <Box sx={{ mr: 2 , display: { xs: 'none', md: 'flex'}}}>
            <Typography
            variant="h6"
            noWrap
            component="a"
            href={`/${country}/${language}`}
            sx={{
                fontWeight: 700,
                color: 'dokusoBlack',
                textDecoration: 'none',
            }}
            >
            Dokusō
            </Typography>
        </Box>
    )
};

export default TitleDesktop;