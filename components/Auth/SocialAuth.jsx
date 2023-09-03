import React from "react";
import { Icon } from "@iconify/react";
import { Stack, IconButton, TextField } from "@mui/material";
import { signInGoogleExternal } from "./signInWithGoogleExternal";
import { useAppDispatch } from "../../redux/hooks";
import { setLogInFlag } from "../../redux/features/actions/auth";

const SocialAuth = () => {
  const dispatch = useAppDispatch();
  const handleSignInGoogle = () => {
    dispatch(setLogInFlag(false));
    signInGoogleExternal();
  };
  const handleSignInFacebook = () => {
    // console.log("ingresar con facebook");
  };

    return (
      <>
        <Stack direction="row" spacing={2}>
          <IconButton
            onClick={handleSignInGoogle}
            sx={{
              borderRadius: "5px",
              padding: "0.5675rem",
              flex: 1,
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              mb: 5
            }}
          >
            <Icon icon="eva:google-fill" color="#FA39BE" width={60} height={60} />
          </IconButton>
          {/* <IconButton
            onClick={handleSignInFacebook}
            sx={{
              borderRadius: "5px",
              padding: "0.5675rem",
              flex: 1,
            }}
          >
            <Icon
              icon="eva:facebook-fill"
              color="#1877F2"
              width={50}
              height={50}
            />
          </IconButton> */}
        </Stack>
      </>
    )
};

export default SocialAuth