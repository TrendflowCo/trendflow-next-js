import React, { useState } from "react";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { Box , Checkbox , FormControlLabel , IconButton , InputAdornment , Link , Stack , TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
// import { logEvent } from "firebase/analytics";
// import { analytics } from "../components/FirebaseComp";
import { getAuth , signInWithEmailAndPassword } from "firebase/auth";
import { useAppDispatch } from "../../redux/hooks";
import { setLogInFlag } from "../../redux/features/actions/auth";
import Button from '@mui/material/Button';
import { ThemeProvider} from '@mui/material/styles';
import { muiColors } from '../Utils/muiTheme';

const LogInForm = () => {
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState(false);

    let easing = [0.6, -0.05, 0.01, 0.99];
    const animate = {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easing,
        delay: 0.16,
      },
    };
    const logInWithEmailAndPassword = async (email, password) => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
            // logEvent(analytics, 'login', {
            //   method: 'email'
            // });
        } catch (err) {
          console.error(err);
          alert(err.message);
        //   logEvent(analytics, 'exception', {
        //     description: 'login_email_error',
        //   });
        }
    };
    const LoginSchema = Yup.object().shape({
        email: Yup.string()
          .email("Provide a valid email address")
          .required("Email is required"),
        password: Yup.string().required("Password is required"),
    });
    const formik = useFormik({
        initialValues: {
          email: "",
          password: "",
          remember: true,
        },
        validationSchema: LoginSchema,
        onSubmit: () => {
          setTimeout(() => {
            dispatch(setLogInFlag(false))
          }, 2000);
        },
    });
    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;
    // logEvent(analytics, 'page_view', {
    //   page_title: 'login',
    //   client_id: values.email
    // });

    return (
    <>
        <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Box sx={{paddingX: '18px', marginTop: '12px'}}>
            <Box
              sx={{ display: "flex" , flexDirection: "column" , gap: 3 }}
              initial={{ opacity: 0, y: 40 }}
            >
                <TextField 
                    fullWidth 
                    autoComplete="username" 
                    type="email" 
                    label="Email Address" 
                    {...getFieldProps("email")} 
                    error={Boolean(touched.email && errors.email)} 
                    helperText={touched.email && errors.email}
                    inputProps={{ style: {height: "36px"} }}
                />
                <TextField
                    fullWidth
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    {...getFieldProps("password")}
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                    inputProps={{ style: {height: "36px"} }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                {showPassword ? (
                                <Icon icon="eva:eye-fill" />
                                ) : (
                                <Icon icon="eva:eye-off-fill" />
                                )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={animate}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ my: 2 }}
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                            {...getFieldProps("remember")}
                            checked={values.remember}
                            />
                        }
                        label="Remember me"
                    />
                    <Link
                        //   component={RouterLink}
                        variant="subtitle2"
                        to="#"
                        underline="hover"
                    >
                        Forgot password?
                    </Link>
                </Stack>
                <ThemeProvider theme={muiColors}>
                    <LoadingButton
                        fullWidth={true}
                        className="bg-dokuso-blue" 
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        onClick={() => logInWithEmailAndPassword(values.email, values.password)}
                    >
                        {isSubmitting ? "loading..." : "Login"}
                </LoadingButton>
              </ThemeProvider>
            </Box>
          </Box>
        </Form>
      </FormikProvider>
      </>
    )
};

export default LogInForm