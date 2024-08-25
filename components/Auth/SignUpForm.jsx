import React, { useState } from "react";
import { TextField, Button, Box, InputAdornment, IconButton } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react";
import { sendSignInLink } from './authFunctions';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const SignUpForm = ({ onSignUpSuccess, onSignUpError }) => {
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Required"),
            password: Yup.string().min(6, "Password must be at least 6 characters").required("Required"),
        }),
        onSubmit: async (values) => {
            try {
                await sendSignInLink(values.email, values.password);
                toast.success("Verification link sent to your email");
                onSignUpSuccess();
            } catch (error) {
                toast.error(error.message || "Failed to send verification link");
                onSignUpError(error);
            }
        },
    });

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={formik.handleSubmit}
        >
            <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                id="email"
                name="email"
                label="Email Address"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                id="password"
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                <Icon icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <Box mt={3}>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    style={{ backgroundColor: 'var(--trendflow-pink)' }}
                >
                    Sign Up
                </Button>
            </Box>
        </motion.form>
    );
};

export default SignUpForm;