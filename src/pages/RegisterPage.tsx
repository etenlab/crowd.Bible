import { useState } from "react";
import { useHistory } from "react-router-dom";

import {
  Button,
  MuiMaterial,
  Typography,
  colors,
  Input,
  PasswordInput,
} from "@eten-lab/ui-kit";
import { useFormik } from "formik";
import * as Yup from "yup";

// import axios from "axios";

const { Box } = MuiMaterial;

const validationSchema = Yup.object().shape({
  username: Yup.string().required("First name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
});

export function RegisterPage() {
  const [show, setShow] = useState<boolean>(false);
  const history = useHistory();
  const formik = useFormik<{
    email: string | null;
    username: string | null;
    password: string | null;
    passwordConfirm: string | null;
  }>({
    initialValues: {
      email: null,
      username: null,
      password: null,
      passwordConfirm: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // const url = `${process.env.REACT_APP_DATABASE_API_URL}/users/register`;
      // const queryParams = { realm: process.env.REACT_APP_REALM_NAME };
      // const headers = { "Content-Type": "application/json" };
      // const requestBody = {
      //   email: values.email,
      //   username: values.username,
      //   password: values.password,
      // };
      // try {
      //   const result = await axios.post(url, requestBody, {
      //     params: queryParams,
      //     headers: headers,
      //   });
      //   console.log("register page register result ==>", result);
      // } catch (err) {
      //   console.log(err);
      // }
      history.push("/login");
    },
  });

  const handleToggleShow = () => {
    setShow((show) => !show);
  };

  const handleGoLoginPage = () => {
    history.push("/login");
  };

  const handleRegister = () => {
    if (!formik.isValid) {
      return;
    }

    formik.submitForm();
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "123px 20px 20px 20px",
        gap: "12px",
      }}
      noValidate
      autoComplete="off"
    >
      <Typography
        variant="h1"
        sx={{ color: colors["dark"], marginBottom: "18px" }}
      >
        Register
      </Typography>

      <Input
        id="email"
        name="email"
        type="text"
        label="Email"
        onChange={formik.handleChange}
        value={formik.values.email}
        valid={
          formik.values.email !== null
            ? !Boolean(formik.errors.email)
            : undefined
        }
        helperText={formik.errors.email}
        fullWidth
      />

      <Input
        id="username"
        name="username"
        type="text"
        label="Username"
        onChange={formik.handleChange}
        value={formik.values.username}
        valid={
          formik.values.username !== null
            ? !Boolean(formik.errors.username)
            : undefined
        }
        helperText={formik.errors.username}
        fullWidth
      />

      <PasswordInput
        id="password"
        name="password"
        label="Password"
        onChange={formik.handleChange}
        onClickShowIcon={handleToggleShow}
        show={show}
        value={formik.values.password}
        valid={
          formik.values.password !== null
            ? !Boolean(formik.errors.password)
            : undefined
        }
        helperText={formik.errors.password}
        fullWidth
      />

      <PasswordInput
        id="passwordConfirm"
        name="passwordConfirm"
        label="Repeat Password"
        onChange={formik.handleChange}
        onClickShowIcon={handleToggleShow}
        show={show}
        value={formik.values.passwordConfirm}
        valid={
          formik.values.passwordConfirm !== null
            ? !Boolean(formik.errors.passwordConfirm)
            : undefined
        }
        helperText={formik.errors.passwordConfirm}
        fullWidth
      />

      <Button
        variant="contained"
        endIcon
        fullWidth
        onClick={handleRegister}
        disabled={!formik.isValid}
      >
        Register Now
      </Button>

      <Button
        variant="text"
        endIcon
        fullWidth
        color="gray"
        onClick={handleGoLoginPage}
      >
        Do you have an account?
      </Button>
    </Box>
  );
}
